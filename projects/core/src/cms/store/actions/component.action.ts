import { CmsComponent } from '../../../occ/occ-models/index';
import {
  EntityFailAction,
  EntityLoadAction,
  EntitySuccessAction
} from '../../../state/utils/entity-loader/entity-loader.action';
import { COMPONENT_ENTITY } from '../cms-state';

export const LOAD_COMPONENT = '[Cms] Load Component';
export const LOAD_COMPONENT_FAIL = '[Cms] Load Component Fail';
export const LOAD_COMPONENT_SUCCESS = '[Cms] Load Component Success';
export const GET_COMPONENET_FROM_PAGE = '[Cms] Get Component from Page';

export class LoadComponent extends EntityLoadAction {
  readonly type = LOAD_COMPONENT;
  constructor(public payload: string) {
    super(COMPONENT_ENTITY, payload);
  }
}

export class LoadComponentFail extends EntityFailAction {
  readonly type = LOAD_COMPONENT_FAIL;
  constructor(uid: string, public payload: any) {
    super(COMPONENT_ENTITY, uid, payload);
  }
}

export class LoadComponentSuccess<
  T extends CmsComponent
> extends EntitySuccessAction {
  readonly type = LOAD_COMPONENT_SUCCESS;
  constructor(public payload: T) {
    super(COMPONENT_ENTITY, payload.uid);
  }
}

export class GetComponentFromPage<
  T extends CmsComponent
> extends EntitySuccessAction {
  readonly type = GET_COMPONENET_FROM_PAGE;
  constructor(public payload: T[]) {
    super(COMPONENT_ENTITY, payload.map(cmp => cmp.uid));
  }
}

// action types
export type ComponentAction<T extends CmsComponent> =
  | LoadComponent
  | LoadComponentFail
  | LoadComponentSuccess<T>
  | GetComponentFromPage<T>;
