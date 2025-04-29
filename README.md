# Avantos Form Prefill Mapping UI

This project implements a node-based UI for displaying and configuring form prefilling in a directed acyclic graph (DAG) of forms. It allows users to map values from upstream forms and global data sources to prefill fields in downstream forms.
To add new data sources to the system add them to enum SourceType and then add them to sources to FormPrefillPanel.

## Features

* Visualization of form dependencies using React Flow
* Interactive node graph showing form relationships
* Form prefill configuration panel
* Dynamic source selection for field mapping
* Search functionality for finding fields across all sources
* Support for both form-based and global data sources
* Responsive UI with intuitive controls

## Getting Started

### Prerequisites

Node.js 16+
npm
Installation

Clone the repository:

```npm install```

```npm run dev```

## Technologies Used

* React 18
* TypeScript
* Vite
* React Flow
* SCSS Modules
* React Icons
* Vitest for testing
* React Query
