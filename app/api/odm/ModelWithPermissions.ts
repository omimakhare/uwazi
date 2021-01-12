import mongoose from 'mongoose';
import { getUserInContext } from 'api/permissions/permissionsContext';
import { createUpdateLogHelper } from './logHelper';
import { DataType, OdmModel } from './model';
import { models } from './models';

const appendPermissionQuery = (query: any, level: any) => {
  const user = getUserInContext();
  if (!['admin', 'editor'].includes(user.role)) {
    return {
      ...query,
      permissions: { $elemMatch: { _id: getUserInContext()._id, level } },
    };
  }

  return query;
};

export class ModelWithPermissions<T> extends OdmModel<T> {
  async save(data: DataType<T>) {
    return super.save(data, appendPermissionQuery({ _id: data._id }, 'write'));
  }
}

export function instanceModel<T = any>(collectionName: string, schema: mongoose.Schema) {
  const logHelper = createUpdateLogHelper<T>(collectionName);
  const model = new ModelWithPermissions<T>(logHelper, collectionName, schema);
  models[collectionName] = model;
  return model;
}
