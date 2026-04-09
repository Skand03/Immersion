Project Preparation Guide - React Destination Management

1. What this project does
- Create destination
- View destination list
- Search by name
- Update destination
- Delete destination
- Pagination support
- Client-side validation
- Server-side error handling
- Authorization header in every API request

2. Assignment requirement mapping
- Create API: done in src/components/DestinationForm.jsx and src/api/destinationApi.js
- Update API: done in src/components/DestinationForm.jsx and src/api/destinationApi.js
- Delete API: done in src/components/DestinationList.jsx and src/api/destinationApi.js
- Get all destinations: done in src/components/DestinationList.jsx and src/api/destinationApi.js
- Authorization Bearer header: done in src/api/destinationApi.js
- Validation: done in src/components/DestinationForm.jsx
- Error handling: done in form and list using try/catch and user alerts

3. File-by-file explanation

3.1 src/App.jsx
- Keeps global page state.
- selectedDestination stores selected row for edit mode.
- refreshTick is a number used to refresh list after create/update.
- message stores success or error message for user.
- apiConfig stores baseUrl and token from environment variables.
- showMessage(type, text) sets message for alert.
- clearSelection() exits edit mode.
- triggerRefresh() increments refreshTick so list re-fetch happens.
- Renders:
  - Header
  - Alert message
  - DestinationForm component
  - DestinationList component

3.2 src/api/destinationApi.js
- This file contains all axios calls only.
- normalizeApiError(error):
  - Reads status code and detail from server response.
  - Returns consistent object with statusCode and detail.
- buildRequestConfig(apiConfig):
  - Adds baseURL.
  - Adds Authorization header with Bearer token.
  - Adds Content-Type application/json.
  - Uses /api-proxy in development for CORS-safe local calls.
- validateApiConfig(apiConfig):
  - Throws error if baseUrl or token missing.
- createDestination, updateDestination, deleteDestination, getDestinations:
  - Call required endpoints.
  - Use try/catch.
  - Throw normalized error.

3.3 src/components/DestinationForm.jsx
- Holds formData state for name, description, meta.
- Detects edit mode when selectedDestination exists.
- useEffect fills form in edit mode and clears form in create mode.
- validate() checks:
  - In create mode: name and description required.
  - In edit mode: at least one field must change.
- handleSubmit():
  - Prevents default form reload.
  - Validates form first.
  - Calls update API in edit mode.
  - Calls create API in create mode.
  - Resets form and errors on success.
  - Calls onSaved() so list refreshes.
  - Shows readable error message on failure.

3.4 src/components/DestinationList.jsx
- Stores destinations, loading, search, page, perPage, metadata.
- orderedDestinations sorts current page list by numeric id ascending.
- fetchDestinations() calls GET API with page, perPage, name search.
- useEffect calls fetch when dependencies change:
  - baseUrl, token, page, perPage, searchTerm, refreshTick
- handleSearchSubmit(): sets searchTerm and resets to page 1.
- handleClearSearch(): clears search and page resets to 1.
- handleDelete(destination): asks confirm then deletes selected row.
- Renders:
  - Search row
  - Per page selector
  - Loading spinner
  - Empty state if no data
  - Table of destinations
  - Pagination controls

4. Important React syntax explained (easy words)

- useState
  - Creates state variable.
  - Example pattern: const [value, setValue] = useState(initialValue)

- useEffect
  - Runs function when component loads or dependencies change.
  - Used for API fetching.

- Optional chaining ?. 
  - Safe access for nested fields.
  - Example: error?.response?.status
  - Prevents crash when any value is null/undefined.

- Template literal ${}
  - Creates dynamic strings.
  - Example: /admin/update-destination/${id}

- Spread operator ...
  - Copies object/array values.
  - Example: setFormData({ ...formData, name: value })

- Ternary condition ? :
  - Inline if/else in JSX.
  - Example: isEditMode ? Update : Create

5. How to explain createdBy in interview
- Frontend does not send createdBy in create request.
- Backend reads user from Bearer token.
- Backend sets createdBy and createdById.
- GET API returns createdBy fields.
- UI only displays those values.

6. How to test complete flow quickly

1. Create test
- Enter name and description.
- Click Create.
- Expect success message and new row appears.

2. Read test
- Use search with new name.
- Expect row appears in list.

3. Update test
- Click Edit on your row.
- Change description or name.
- Click Update.
- Expect success message and updated data.

4. Delete test
- Click Delete on your own row.
- Confirm popup.
- Expect row removed and success message.

5. Authorization header test
- Open browser devtools Network tab.
- Trigger any API request.
- In Request Headers check Authorization: Bearer ...

7. How to test error handling

Client-side validation errors
- Create without name and description.
- Expect local validation messages.

Server-side auth error
- Put wrong token in .env and restart dev server.
- Trigger API call.
- Expect 401 or auth error message shown.

Server-side validation error
- Send invalid payload.
- Expect server status error and friendly message.

Network error
- Put wrong base URL in .env and restart.
- Expect network error message shown in alert.

8. Short viva answer you can speak
- I built a React destination management flow with create, list, update, delete.
- I separated API calls into a dedicated api file for clean structure.
- I implemented required validation for create and update flows.
- I added pagination and search using API query parameters.
- I handled both client and server errors with clear user alerts.
- Every request includes Authorization Bearer token as required.

9. Final submission checklist
- npm run lint passes
- npm run build passes
- CRUD manually tested once
- Authorization header confirmed in Network tab
- No console runtime errors from app code
