import { SKUser } from './user.model'
import { Item } from './item.model'

export class PreAudit {
  audit_id: number;
  org: number;
  inventory_items: Item[];
  assigned_sk: SKUser[];
}
