import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const TEST_TYPE = __ENV.TEST_TYPE || "smoke";

const ROUTES = ["/", "/faq", "/hackathon", "/agenda", "/nosotros"];

const OPTIONS_BY_TYPE = {
  smoke: {
    vus: 10,
    duration: "1m",
    thresholds: {
      http_req_failed: ["rate<0.01"],
      http_req_duration: ["p(95)<800", "p(99)<1500"],
    },
  },
  stress: {
    stages: [
      { duration: "2m", target: 50 },
      { duration: "3m", target: 100 },
      { duration: "3m", target: 200 },
      { duration: "2m", target: 0 },
    ],
    thresholds: {
      http_req_failed: ["rate<0.02"],
      http_req_duration: ["p(95)<1200", "p(99)<2500"],
    },
  },
  spike: {
    stages: [
      { duration: "30s", target: 50 },
      { duration: "1m", target: 400 },
      { duration: "1m", target: 400 },
      { duration: "30s", target: 50 },
      { duration: "30s", target: 0 },
    ],
    thresholds: {
      http_req_failed: ["rate<0.03"],
      http_req_duration: ["p(95)<2000", "p(99)<4000"],
    },
  },
};

const selectedOptions = OPTIONS_BY_TYPE[TEST_TYPE] || OPTIONS_BY_TYPE.smoke;

selectedOptions.discardResponseBodies = true;
selectedOptions.userAgent = "compufest-load-test/k6";

export const options = selectedOptions;

const badStatusRate = new Rate("bad_status_rate");

function pickRoute() {
  const idx = Math.floor(Math.random() * ROUTES.length);
  return ROUTES[idx];
}

export default function websiteLoadScenario() {
  const route = pickRoute();
  const response = http.get(`${BASE_URL}${route}`, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Cache-Control": "no-cache",
    },
    tags: {
      route,
      scenario: TEST_TYPE,
    },
  });

  const ok = check(response, {
    "status is successful or redirect": (r) => r.status >= 200 && r.status < 400,
  });

  badStatusRate.add(!ok);

  sleep(Math.random() * 1.4 + 0.3);
}
