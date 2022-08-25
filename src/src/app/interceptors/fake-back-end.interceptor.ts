import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { mergeMap, Observable, of, materialize, delay, dematerialize, timer, throwError } from 'rxjs';
import { PaymentPlan, Plot, PlotStatus } from '../models/plot.model';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import jwt_decode, { JwtPayload as BaseJwtPayload } from 'jwt-decode';

const CLAIMS_EMAIL = "https://www.myhomeaccount.com/email";

interface JwtPayload extends BaseJwtPayload {
  [CLAIMS_EMAIL]: string;
}

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
    ssoId: "auth0|62e43ac09ef7eff16baed140z",
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

    console.log("Intercepting request to " + url, request);
    
    const token = parseJwt();
    const response = handleRoute();

    console.log("Mock response from " + url, response);

    // Add a simulated delay
    return timer(500)
      .pipe(mergeMap(() => response));

    function handleRoute(): Observable<HttpEvent<unknown>> {
      if (token === null) {
        console.log("No token found in request");
        return unauthorized();
      }

      if (url.indexOf('/api/v1/users/login') && method == "POST")
        return login();
      else if (url.indexOf('/api/v1/plots') && method === "GET")
        return getPlots();
      else if (url.endsWith('api/v1/plots') && method ==="POST")
        return createPlot();
      else
        return notFound();
    }

    function parseJwt(): JwtPayload | null {
      let payload: JwtPayload | null = null;

      const authHeader = headers.get("Authorization") ?? headers.get("authorization");
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        payload = jwt_decode<JwtPayload>(token);
      }
      
      return payload;
    }

    function login(): Observable<HttpEvent<unknown>> {
      if (token) {        
        const auth0UserId = token.sub!;
        let user = users.find(x => x.ssoId === auth0UserId);
        if (user) {
          return ok(user);
        }
        else {
          // Find user by email
          const email = token[CLAIMS_EMAIL];
          user = users.find(x => x.email !== null && x.email?.toLowerCase() == email?.toLowerCase());
          if (user !== undefined) {
            console.log("Assigning new user", user.email);
            // Assign user
            users = users.map(x => x.id === user!.id ? {
              ...x,
              ssoId: auth0UserId
            } : x);
            saveSession();
            return ok(user);
          }
          else {
            return notFound();
          }
        }
      }
      return unauthorized();
    }

    function getPlots(): Observable<HttpEvent<unknown>> {
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

    function createPlot(): Observable<HttpEvent<unknown>> {
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
      return of(new HttpResponse({ status: 200, body }));
    }

    function notFound() {
      return throwError(() => new HttpErrorResponse({
        status: 404,
        statusText: "Not Found"
      }));
    }

    function unauthorized() {
      return throwError(() => new HttpErrorResponse({
        status: 401,
        statusText: "Unauthorized"
      }));
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