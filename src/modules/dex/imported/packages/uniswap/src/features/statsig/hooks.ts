import { DynamicConfigs, getConfigName } from '@dex/imported/packages/uniswap/src/features/statsig/configs'
import {
  DEFAULT_EXPERIMENT_ENABLED_VALUE,
  Experiments,
  getExperimentDefinition,
} from '@dex/imported/packages/uniswap/src/features/statsig/experiments'
import { FeatureFlags, getFeatureFlagName } from '@dex/imported/packages/uniswap/src/features/statsig/flags'
import {
  DynamicConfig,
  useConfig,
  useExperiment,
  useExperimentWithExposureLoggingDisabled,
  useGate,
  useGateWithExposureLoggingDisabled,
} from '@dex/imported/packages/uniswap/src/features/statsig/sdk/statsig'

export function useFeatureFlag(flag: FeatureFlags): boolean {
  const name = getFeatureFlagName(flag)
  const { value } = useGate(name)
  return value
}

export function useFeatureFlagWithExposureLoggingDisabled(flag: FeatureFlags): boolean {
  const name = getFeatureFlagName(flag)
  const { value } = useGateWithExposureLoggingDisabled(name)
  return value
}

export function useExperimentEnabled(
  experiment: Experiments,
  checkValue: string = DEFAULT_EXPERIMENT_ENABLED_VALUE
): boolean {
  const experimentDef = getExperimentDefinition(experiment)
  const value = useExperiment(experimentDef.name).config.getValue(experimentDef.key)
  return checkValue === value
}

export function useExperimentEnabledWithExposureLoggingDisabled(
  experiment: Experiments,
  checkValue: string = DEFAULT_EXPERIMENT_ENABLED_VALUE
): boolean {
  const experimentDef = getExperimentDefinition(experiment)
  const value = useExperimentWithExposureLoggingDisabled(experimentDef.name).config.getValue(
    experimentDef.key
  )
  return checkValue === value
}

export function useExperimentValueWithExposureLoggingDisabled(experiment: Experiments): string {
  const experimentDef = getExperimentDefinition(experiment)
  const value = useExperimentWithExposureLoggingDisabled(experimentDef.name).config.getValue(
    experimentDef.key
  )

  if (typeof value !== 'string') {
    const err = new Error(
      `Experiment ${Experiments[experiment]} does not have a properly mapped value`
    )
    throw err
  }

  return value
}

export function useDynamicConfig(config: DynamicConfigs): DynamicConfig {
  const name = getConfigName(config)
  const { config: dynamicConfig } = useConfig(name)
  return dynamicConfig
}
