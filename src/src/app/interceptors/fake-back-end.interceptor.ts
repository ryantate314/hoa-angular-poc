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
import { mergeMap, Observable, of, materialize, delay, dematerialize, timer, throwError, concatMap, tap } from 'rxjs';
import { PaymentPlan, Plot, PlotStatus } from '../models/plot.model';
import { Role, User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import jwt_decode, { JwtPayload as BaseJwtPayload } from 'jwt-decode';
import { Event } from '../models/event.model';
import { Transaction, TransactionType } from '../models/transaction.model';

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

interface DataUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  ssoId: string | null;
  role: Role
}

interface DataTransaction {
  id?: string;
  userId: string | null;
  type: TransactionType,
  amount: number;
  date: string;
  description: string;
  plotId: string;
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
    homeowners: ["846516891", "846516895"]
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

let transactions: DataTransaction[] = [
 {
  id: "asdf123",
  amount: 187.63,
  date: "2022-08-01T00:00:00.000Z",
  description: "HOA Dues",
  type: TransactionType.Debit,
  userId: null,
  plotId: "12345"
 }
];

let users: User[] = [
  {
    email: "ryan.test@claytonhomes.com",
    firstName: "Ryan",
    lastName: "Test",
    ssoId: "auth0|62e43ac09ef7eff16baed140",
    id: "846516891",
    role: Role.Admin
  },
  {
    email: "callie.test@claytonhomes.com",
    firstName: "Callie",
    lastName: "Test",
    ssoId: null,
    id: "846516895",
    role: Role.Homeowner
  },
  {
    email: "charles.stehno@claytonhomes.com",
    firstName: "Chuck",
    lastName: "Test",
    ssoId: null,
    id: "8465168asdfasdf",
    role: Role.Admin
  }
];

let events: Event[] = [
  {
    id: "asdfasdfasdfasdf",
    name: "Pool Party",
    description: "Party at the pool.",
    startDate: new Date(2022, 12, 25, 17),
    endDate: new Date(2022, 12, 25, 18),
    imageUrl: "https://images.pexels.com/photos/7294545/pexels-photo-7294545.jpeg?cs=srgb&dl=pexels-kindel-media-7294545.jpg&fm=jpg",
    location: "Clubhouse"
  }
];

const sessionString = sessionStorage.getItem("mock-back-end-state");
if (sessionString) {
  const session = JSON.parse(sessionString);
  plots = session.plots;
  users = session.users;
  events = session.events;
  transactions = session.transactions;
}
else {
  saveSession();
}

/** Save the current session data to session storage to be re-loaded upon refresh */
function saveSession() {
  const session = {
    plots: plots,
    users: users,
    events: events,
    transactions: transactions
  };
  sessionStorage.setItem("mock-back-end-state", JSON.stringify(session));
}

@Injectable()
export class FakeBackEndInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { url, method, headers, body, params } = request;

    const eventRegex = new RegExp("api/v1/events/(.+)$");
    const usersRegex = new RegExp("api/v1/users/(.+)$");

    const token = parseJwt();
    
    // Add a simulated delay. Place the call to handleRoute() inside the observable chain, because
    // the Auth0 interceptor relies on the observable not being subscribed to. Otherwise, there are duplicate calls.
    return timer(500).pipe(
      concatMap(() => {
        console.log("Intercepting request to " + url, request);
        return handleRoute();
      }),
      tap({
        next: res => console.log("Mocked response to " + url, res),
        error: err => console.log("Mocked response to " + url, err)
      })
    );

    function handleRoute(): Observable<HttpEvent<unknown>> {
      if (token === null) {
        console.log("No token found in request");
        return unauthorized();
      }

      if (url.endsWith('/api/v1/users/login') && method == "POST")
        return login();
      else if (url.includes('/api/v1/users') && method === "GET")
        return getUsers();
      else if (url.endsWith('api/v1/users') && method === "POST")
        return createUser();
      else if (usersRegex.test(url) && method === "DELETE")
        return deleteUser();
      else if (url.includes('/api/v1/plots') && method === "GET")
        return getPlots();
      else if (url.endsWith('api/v1/plots') && method === "POST")
        return createPlot();
      else if (url.endsWith('api/v1/events') && method === "GET")
        return getEvents();
      else if (url.endsWith('api/v1/events') && method === "POST")
        return createEvent();
      else if (eventRegex.test(url) && method === "DELETE")
        return deleteEvent();
      else if (url.endsWith('api/v1/transactions') && method === "GET")
        return getTransactions();
      else if (url.endsWith('api/v1/transactions') && method === "POST")
        return createTransaction();
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
        return ok(
          plots.filter(x =>
            x.homeowners.find(y => y === userId)
          ).map(plot => _convertDataPlotToPlot(plot))
        );
      }
      else {
        // TODO Authorize the user can retrieve all plots
        return ok(plots.map(plot => _convertDataPlotToPlot(plot)));
      }
    }

    function calculatePlotBalance(plotId: string) {
      // Sum all transactions for the plot
      return transactions.reduce((sum, transaction) => {
        if (transaction.plotId === plotId)
          return transaction.type === TransactionType.Credit ?
            sum + transaction.amount
            : sum - transaction.amount;
        else
          return sum;
      }, 0);
    }

    function getUser(id: string) {
      return users.find(x => x.id === id) || null;
    }

    function getUsers(): Observable<HttpEvent<unknown>>{
      return ok(users.map(user => ({
        ...user
      })));
    }

    function createUser(): Observable<HttpEvent<unknown>> {
      // TODO Authorize the user can create users
      const user = <User>body;
      const newUser: DataUser = {
        ...user,
        id: newId()
      };
      users = [
        ...users,
        newUser
      ];
      saveSession();
      return ok(_convertDataUserToUser(newUser));
    }

    function deleteUser() {
      const id = usersRegex.exec(url)![1];

      if (!users.find(u => u.id === id)) {
        console.log("Could not find user with id", id);
        return notFound();
      }

      users = users.filter(u => u.id !== id);
      saveSession();
      return ok();
    }


    function createPlot(): Observable<HttpEvent<unknown>> {
      // TODO Authorize the user can create plots
      const plot = <Plot>body;
      const newPlot: DataPlot = {
        ...plot,
        homeowners: plot.homeowners.map(owner => owner.id!),
        id: newId()
      };
      plots = [
        ...plots,
        newPlot
      ];
      saveSession();
      return ok(_convertDataPlotToPlot(newPlot));
    }

    function getEvents(): Observable<HttpEvent<unknown>> {
      return ok([
        ...events
      ]);
    }

    function createEvent(): Observable<HttpEvent<unknown>> {
      const event = <Event>body;
      const newEvent: Event = {
        ...event,
        id: newId()
      };
      events.push(newEvent);
      saveSession();
      return ok(newEvent);
    }

    function getTransactions(): Observable<HttpEvent<unknown>> {
      const plotId = params.get("plotId");
      let filteredTransactions: DataTransaction[] = [];
      if (plotId) {
        // TODO authorize the user to this plot
        filteredTransactions = transactions.filter(x => x.plotId == plotId)
      }
      else {
        // TODO authorize the user can retrieve all transactions
        filteredTransactions = transactions;
      }
      return ok(
        filteredTransactions.map(tran => _convertDataTranToTran(tran))
      );
    }

    function deleteEvent() {
      const eventId = eventRegex.exec(url)![1];

      if (!events.find(e => e.id === eventId)) {
        console.log("Could not find event with id", eventId);
        return notFound();
      }

      events = events.filter(e => e.id !== eventId);
      saveSession();
      return ok();
    }

    function createTransaction(): Observable<HttpEvent<unknown>> {
      const tran = <Transaction>body;
      const plotId = params.get("plotId")!;
      console.log("Creating transaction", tran, plotId);
      // TODO authorize the user to this plot
      // TOOD ensure UserId is the same as token userId
      const newDataTran: DataTransaction = {
        id: newId(),
        plotId: plotId,
        date: new Date().toISOString(),
        amount: tran.amount,
        description: tran.description,
        type: tran.type,
        userId: tran.userId,
      };
      transactions = [
        ...transactions,
        newDataTran
      ];
      saveSession();
      return ok(_convertDataTranToTran(newDataTran));
    }

    function _convertDataPlotToPlot(plot: DataPlot): Plot {
      return {
        ...plot,
        homeowners: users.filter(user => plot.homeowners.includes(user.id!)),
        accountBalance: calculatePlotBalance(plot.id!)
      };
    }

    function _convertDataUserToUser(user: DataUser): User {
      return {
        ...user
      };
    }

    function _convertDataTranToTran(tran: DataTransaction): Transaction {
      const plot = plots.find(plot => plot.id === tran.plotId);
      return {
        ...tran,
        plot: plot ? {
          ...plot,
          accountBalance: calculatePlotBalance(plot.id!),
          homeowners: users.filter(user => plots)
        } : undefined,
        user: getUser(tran.userId!)!,
        date: tran.date as unknown as Date
      };
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