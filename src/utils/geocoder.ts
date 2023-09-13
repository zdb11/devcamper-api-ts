import Geocoder, { BaseOptions, Options, Providers } from 'node-geocoder'
import sanitizedConfig from '../config/config.js'

const options: Options = {
    provider: (sanitizedConfig.GEOCODER_PROVIDER as Providers),
    apiKey: sanitizedConfig.GEOCODER_API_KEY,
    formatter: null
}
export const geocoder = Geocoder(options)