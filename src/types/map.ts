export type GeoJsonFeatureCollection = {
  features: GeoJsonFeature[],
  type: 'FeatureCollection'
}

export type GeoJsonFeature = {
  geometry: GeoJsonPoint,
  properties: {
    name: string
  },
  type: 'Feature'
}

export type GeoJsonPoint = {
  coordinates: GeoJsonCoordinates,
  type: 'Point'
}

export type GeoJsonCoordinates = [number, number]