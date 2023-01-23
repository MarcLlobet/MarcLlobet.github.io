import Head from 'next/head'
import Image from 'next/image'
import { Noto_Serif_Display } from '@next/font/google'
import { Map, Marker } from "pigeon-maps"
import GeoJsonData from '@/data/geo.json'
import { GeoJsonFeatureCollection } from '@/types/map'
import MllSVG from 'public/mll.svg'
import MarkerSVG from 'public/marker.svg'

const Noto = Noto_Serif_Display()

type HomeProps = {
  mapDetails: GeoJsonFeatureCollection
}

const MAP_ID = 'd40b681a-4432-49a2-a044-a4c5dd1a239e'
const MAPTILER_ACCESS_TOKEN = 'I0ZHCXgpFw9I6mZPxwM1' // 'xokEC0yXwkBZMEh6M6w4'

function mapTiler (x, y, z, dpr) {
  const apiBaseUrl = 'https://api.maptiler.com'
  const mapsEndpoint = 'maps'

  return `${apiBaseUrl}/${mapsEndpoint}/${MAP_ID}/?key=${MAPTILER_ACCESS_TOKEN}#${z}/${x}/${y}`

  return `${apiBaseUrl}/${mapsEndpoint}/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
}

const handleMarkerClick = props => {
  console.log(props, 'click')
}

const handleMarkerHover = props => {
  console.log(props, 'hover')
}

export default function Home({mapDetails}: HomeProps) {
  return (
    <>
    <style jsx global>{`
        html {
          font-family: ${Noto.style.fontFamily};
        }
      `}</style>
      <Head>
        <title>MLL</title>
        <meta name="description" content="MLL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      <Map
        dprs={[1, 2]}
        height={600} 
        defaultCenter={[0, 0]}
        defaultZoom={2}
        // provider={mapTiler}
      >
        {
          mapDetails.features.map(({properties, geometry}) => {
            const [lng, lat] = geometry.coordinates
            return (
              <Marker 
                key={properties.name}
                width={50} 
                anchor={[lat, lng]}
                onClick={handleMarkerClick}
                onMouseOver={handleMarkerHover}
              >
                <Image
                  src={MarkerSVG}
                  alt="mll"
                />
              </Marker>
            )
          })
        }
      </Map>
      </main>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      mapDetails: GeoJsonData
    }
  }
}