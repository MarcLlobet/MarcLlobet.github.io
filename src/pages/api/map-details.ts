// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import MapDetails from '@/data/geo.json'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): void {
  res.status(200).json(MapDetails)
}
