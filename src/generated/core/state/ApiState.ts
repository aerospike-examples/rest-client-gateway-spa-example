/*
 * WARNING: DO NOT EDIT THIS FILE. This file is generated by yarn gen. Any changes will be overwritten.
 */

import { TypedMap } from "../../../core/types/TypedMap";
import { ClusterInformationOperationsState } from "../state/clusterInformationOperationsStates";
import { KeyValueOperationsState } from "../state/keyValueOperationsStates";
import { OperateOperationsState } from "../state/operateOperationsStates";

export interface LastApiCall {
  successValue: any;
  errorValue: any;
}

interface ApiStateFields {
  readonly clusterInformationOperations: ClusterInformationOperationsState;
  readonly keyValueOperations: KeyValueOperationsState;
  readonly operateOperations: OperateOperationsState;
  readonly last: LastApiCall;
}

export type ApiState = TypedMap<ApiStateFields>;