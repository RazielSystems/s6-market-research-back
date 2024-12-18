import { CustomError } from '../exceptions/customError';
import { IQuery } from '../interfaces/item.interface';
import { ItemModel } from '../schema/items.schema';
import mongooseService from '../services/mongoose.service';

class ItemsModels {
  static mongodb = mongooseService.getMongoose();

  static getPagination = (query: IQuery) => {
    const page = query.page || 1;
    let pageSize = query.pageSize || 10;
    pageSize = pageSize < 1 ? 10 : pageSize > 200 ? 200 : pageSize;

    return { limit: pageSize, skip: (page - 1) * pageSize };
  };

  static queryString = (cadena: String) => {
    cadena = cadena
      .toLowerCase()
      .replace('ñ', '#')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/a/g, '[a,á,à,ä]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/#/g, 'ñ');

    return { $regex: cadena, $options: 'i' };
  };

  static search = async (query: IQuery) => {
    console.log('query: ', query);
    try {
      const options = this.getPagination(query);
      const sQuery = query.query;
      const conditions = [{ 'suppliers.id': this.queryString(sQuery) }, { description: this.queryString(sQuery) }, { 'suppliers.name': this.queryString(sQuery) }];

      console.log('options: ', options);
      // const resultado = await ItemModel.find({ $or: conditions }, null, options);
      const resultado = await ItemModel.aggregate([
        { $match: { $or: conditions } },
        { $skip: options.skip },
        { $limit: options.limit },
        {
          $lookup: {
            from: 'data_parties',
            let: { suppliers: '$suppliers.id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$id', '$$suppliers'] } } },
              {
                $group: {
                  _id: '$identifier.id',
                  data: { $push: '$$CURRENT' }
                }
              },
              {
                $project: {
                  _id: 0,
                  id: '$_id',
                  data: 1
                }
              }
            ],
            as: 'supplier_data'
          }
        },
        {
          $unwind: '$supplier_data'
        },
        {
          $lookup: {
            from: 'listado_efos_definitivos',
            let: { suppliers: '$supplier_data.id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$rfc', '$$suppliers'] } } },
              {
                $group: {
                  _id: '$rfc',
                  otrosCampos: { $first: '$$ROOT' }
                }
              },
              { $replaceRoot: { newRoot: '$otrosCampos' } }
            ],
            as: 'efos'
          }
        },
        {
          $lookup: {
            from: 'data_participacion',
            let: { suppliers: '$supplier_data.id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$participacion.rfc', '$$suppliers'] } } },
              {
                $group: {
                  _id: '$declarante',
                  otrosCampos: { $first: '$$ROOT' }
                }
              },
              { $replaceRoot: { newRoot: '$otrosCampos' } }
            ],
            as: 'servidores_publicos'
          }
        },
        {
          $lookup: {
            from: 'sistema3P',
            let: { suppliers: '$suppliers.name' },
            pipeline: [
              { $match: { $expr: { $eq: ['$particularSancionado.nombreRazonSocial', '$$suppliers'] } } },
              {
                $group: {
                  _id: '$rfc',
                  otrosCampos: { $first: '$$ROOT' }
                }
              },
              { $replaceRoot: { newRoot: '$otrosCampos' } }
            ],
            as: 'sanciones'
          }
        }
      ]);

      // console.log('resultado: ', resultado);

      return resultado;
    } catch (error: object | any) {
      console.error('error: ', error);
      throw new CustomError('item-model-1001', 'fallo la consulta', error.message);
    }
  };
}

export default ItemsModels;
