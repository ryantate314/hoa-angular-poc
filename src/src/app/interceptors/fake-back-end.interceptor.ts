import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
} from '@angular/common/http';
import { mergeMap, Observable, of, materialize, delay, dematerialize, timer } from 'rxjs';
import { PaymentPlan, Plot, PlotStatus } from '../models/plot.model';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

interface DataPlot {
  id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  status: PlotStatus;
  paymentPlan: PaymentPlan;
  homeowners: string[];
}

// Sample data the first time the user loads the application
let plots: DataPlot[] = [
  {
    id: "12345",
    street: "123 Test St",
    city: "Maryville",
    state: "TN",
    zip: "37803",
    paymentPlan: PaymentPlan.Monthly,
    status: PlotStatus.Occupied,
    homeowners: ["846516891"]
  },
  {
    id: "12346",
    street: "124 Test St",
    city: "Maryville",
    state: "TN",
    zip: "37803",
    paymentPlan: PaymentPlan.Monthly,
    status: PlotStatus.Vacant,
    homeowners: []
  }
];

let users: User[] = [
  {
    email: "ryan.test@claytonhomes.com",
    firstName: "Ryan",
    lastName: "Test",
    ssoId: "12345789",
    id: "846516891"
  }
];

const sessionString = sessionStorage.getItem("mock-back-end-state");
if (sessionString) {
  const session = JSON.parse(sessionString);
  plots = session.plots;
  users = session.users;
}

/** Save the current session data to session storage to be re-loaded upon refresh */
function saveSession() {
  const session = {
    plots: plots,
    users: users
  };
  sessionStorage.setItem("mock-back-end-state", JSON.stringify(session));
}

@Injectable()
export class FakeBackEndInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { url, method, headers, body, params } = request;

    // TODO validate JSON token

    return timer(500)
      .pipe(mergeMap(() => of(handleRoute())));

    function handleRoute(): HttpEvent<unknown> {
      if (url.indexOf('/api/v1/plots') && method === "GET")
        return getPlots();
      else if (url.endsWith('api/v1/plots') && method ==="POST")
        return createPlot();
      else
        return notFound();
    }

    function getPlots(): HttpResponse<unknown> {
      if (params.get("userId")) {
        // TODO Authorize the user to this ID
        const userId = params.get("userId");
        return ok(plots.filter(x => x.homeowners.find(y => y === userId)));
      }
      else {
        // TODO Authorize the user can retrieve all plots
        return ok([
          ...plots
        ]);
      }
    }

    function createPlot(): HttpResponse<unknown> {
      // TODO Authorize the user can create plots
      const newPlot: DataPlot = {
        ...<Plot>body,
        homeowners: [],
        id: newId()
      };
      plots = [
        ...plots,
        newPlot
      ];
      saveSession();
      return ok(newPlot);
    }

    function ok(body: any = null) {
      return new HttpResponse({ status: 200, body });
    }

    function notFound() {
      return new HttpResponse({ status: 404 });
    }

    function newId() {
      return uuidv4();
    }
  }
}

export const FAKE_BACKEND_INTERCEPTOR: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackEndInterceptor,
  multi: true
};