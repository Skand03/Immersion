# Immersions - ReactJS Assessment

Simple Bootstrap-based UI for GAIA destination flow with complete API integration.

## Features

- Create destination
- Update destination
- Delete destination
- Get destination list with pagination
- Search by destination name
- Client-side and server-side error handling
- Bearer token support on all API calls

## Tech Stack

- React + Vite
- Axios
- Bootstrap 5

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure API values:

- Create a `.env` file using `.env.example`.

Environment variable names:

- `VITE_API_BASE_URL`
- `VITE_API_TOKEN`

3. Run development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run eslint

## API Endpoints Implemented

- `POST /admin/create-destination`
- `PUT /admin/update-destination/{destinationId}`
- `DELETE /admin/delete-destination/{destinationId}`
- `GET /admin/destinations?page=&perPage=&name=`




