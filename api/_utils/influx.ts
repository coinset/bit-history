import {
  InfluxDB,
  Point,
} from "https://cdn.skypack.dev/@influxdata/influxdb-client-browser?dts";

const token = Deno.env.get("INFLUX_DB_TOKEN")!;
const org = Deno.env.get("INFLUX_DB_ORG")!;
const bucket = Deno.env.get("INFLUX_DB_BUCKET")!;

const client = new InfluxDB({
  url: "https://ap-southeast-2-1.aws.cloud2.influxdata.com",
  token,
});

const WriteApi = client.getWriteApi(org, bucket);

type LastPrice = {
  label: string;
  price: number;
};

function getPoints(market: string, last: LastPrice[]): ArrayLike<Point> {
  return last.map(({ label, price }) => {
    return new Point(market).floatField(label, price);
  });
}

function writeBatch(market: string, last: LastPrice[]) {
  const points = getPoints(market, last);

  WriteApi.writePoints(points);
  return WriteApi.flush();
}

export { writeBatch };
export type { LastPrice };
