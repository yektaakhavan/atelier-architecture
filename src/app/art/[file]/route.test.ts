import { artFileNames } from "@/lib/art";
import { GET, generateStaticParams } from "./route";

const request = (file: string) =>
  GET(new Request(`http://localhost/art/${file}`), { params: Promise.resolve({ file }) });

describe("artwork route", () => {
  it("prerenders every artwork file", () => {
    expect(generateStaticParams().map((p) => p.file)).toEqual(artFileNames);
  });

  it("serves a standalone, immutably cached SVG", async () => {
    const response = await request("volumes-olive.svg");
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("image/svg+xml");
    expect(response.headers.get("Cache-Control")).toContain("immutable");
    expect(body).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(body).toContain('viewBox="0 0 800 600"');
  });

  it("uses the tone's palette", async () => {
    const night = await (await request("plan-night.svg")).text();
    const olive = await (await request("plan-olive.svg")).text();
    expect(night).toContain("#2a2d27");
    expect(olive).not.toContain("#2a2d27");
  });

  it("returns 404 for anything that is not an artwork", async () => {
    expect((await request("nope.svg")).status).toBe(404);
  });
});
