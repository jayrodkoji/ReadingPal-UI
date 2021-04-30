import {ImageUtils} from '../../rp-utils/image-utils';

// Now unsused
export class BadgeIcon
{
  public id: number;
  public icon: string;
  public createdBy: string;

  public constructor(data: any) {
    this.id = data.id;
    this.icon = ImageUtils.convertDBImage(data.icon);
    this.createdBy = data.createdBy;
  }
}

export class BadgeData
{
  public icon: string;
  public name: string;
  public description: string;
  public createdBy: string;
  public id: number;

  public constructor(data: any) {
    this.icon = ImageUtils.convertDBImage(data.icon);
    this.name = data.name;
    this.description = data.description;
    this.createdBy = data.createdBy;
    this.id = data.id;
  }
}

export class UserBadge
{
  public badgeData: BadgeData;
  public timestamp: bigint; // TODO: Figure out if bigint is the best for this
  public meta: string;
}
