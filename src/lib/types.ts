// ===== TYPES =====
// Tất cả type definitions cho dữ liệu thí nghiệm luận án

export type SoilState = 'IL_078' | 'IL_10' | 'IL_15';
export type SpacingRatio = 'sD_25' | 'sD_30' | 'sD_35';
export type GeogridCondition = 'with_geogrid' | 'without_geogrid';
export type AppMode = 'lab' | 'defense' | 'presentation';

export interface SoilStateInfo {
  id: SoilState;
  IL: number;
  label: string;
  labelEn: string;
  state: string;
  cu: number; // kPa
  Es: number; // kPa
  color: string;
}

export interface SingleColumnResult {
  IL: SoilState;
  geogrid: GeogridCondition;
  sigmaMax: number;
  epsilonMax: number;
  Ei: number;
  qult: number;
  E50: number;
  sigma50: number;
  epsilon50: number;
  stressStrainCurve: { epsilon: number; sigma: number }[];
}

export interface GroupColumnResult {
  sD: SpacingRatio;
  pressureLevels: number[];
  settlement: number[]; // mm
  columnStress: number[]; // kPa
  soilPressure: number[]; // kPa
  stressConcentration: number[]; // n
  geogridStrain: number[]; // kN/m
}

export interface NumericalResult {
  parameter: string;
  parameterValues: number[];
  pressureLevels: number[];
  nValues: number[][]; // [paramValue][pressureLevel]
}

export interface ExperimentScenario {
  id: string;
  name: string;
  nameEn: string;
  type: 'single' | 'group';
  IL?: SoilState;
  sD?: SpacingRatio;
  geogrid?: GeogridCondition;
  description: string;
}

export interface MaterialProperty {
  name: string;
  nameEn: string;
  symbol: string;
  unit: string;
  value: string | number;
  source?: string;
}

export interface ProcedureStep {
  step: number;
  title: string;
  description: string;
  purpose: string;
  controlledParams: string[];
  possibleErrors: string[];
}

export interface ComparisonMetric {
  name: string;
  nameEn: string;
  unit: string;
  values: Record<string, number>;
}

export interface TabConfig {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
}
