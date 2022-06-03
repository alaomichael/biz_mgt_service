/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import HealthCheck from "@ioc:Adonis/Core/HealthCheck"
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get("health", async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});


Route.group(() => {
  Route.group(() => {
    // Route.resource('businesses/payouts', 'PayoutsController').apiOnly()
    // Route.resource('users.investment', 'InvestmentsController').apiOnly()
    // Route.resource('investment', 'InvestmentsController').apiOnly()

    // POST ROUTES
    Route.post("businesses", "InvestmentsController.store");
    Route.post("businesses/approvals", "ApprovalsController.store");
    Route.post("admin/businesses", "InvestmentsController.store");
    Route.post("admin/businesses/approvals", "ApprovalsController.store");
    Route.post(
      "admin/businesses/transactions",
      "InvestmentsController.processPayment"
    );
    Route.post("admin/businesses/settings", "SettingsController.store");
    Route.post("businesses/tenants", "TenantsController.store");

    // GET ROUTES
    Route.get("businesses/tenants", "TenantsController.index");
    Route.get("businesses/tenants/:userId", "TenantsController.index");
    Route.get("admin/businesses", "InvestmentsController.index");
    Route.get("admin/businesses/settings", "SettingsController.index");
    Route.get("admin/businesses/approvals", "ApprovalsController.index");
    Route.get("admin/businesses/feedbacks", "TenantsController.feedbacks");
    Route.get(
      "admin/businesses/transactionsfeedbacks",
      "AgentsController.transactionStatus"
    );
    Route.get(
      "admin/businesses/:tenantId",
      "TenantController.showByTenantId"
    );
    Route.get(
     "businesses/:tenantId",
      "TenantController.showByTenantId"
    );

    // PUT ROUTES
    Route.put("admin/businesses/settings", "SettingsController.update");
    Route.put("admin/businesses/approvals", "ApprovalsController.update");
    Route.put("admin/businesses", "InvestmentsController.update");
    Route.put("businesses", "InvestmentsController.update");

    // DELETE ROUTES
    Route.delete("admin/businesses/settings", "SettingsController.destroy");
    Route.delete("admin/businesses/approvals", "ApprovalsController.destroy");
    Route.delete("admin/businesses/:userId", "InvestmentsController.destroy");
    Route.delete("businesses/:userId", "InvestmentsController.destroy");
  });
}).prefix("api/v2");