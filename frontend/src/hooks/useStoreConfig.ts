import { useEffect, useState } from 'react'
import { fetchConfig, type StoreConfig } from '../api/client'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../utils/currency'

const defaultConfig: StoreConfig = {
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  shippingCost: SHIPPING_COST,
  currency: 'KES',
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig)

  useEffect(() => {
    fetchConfig()
      .then(setConfig)
      .catch(() => setConfig(defaultConfig))
  }, [])

  return config
}
