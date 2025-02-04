# Media Gallery

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting started

- Clone repository `gh repo clone angiestavnk/media-gallery` or Download archive
- Navigate to the project directory 
- Install dependencies with `npm install` or `yarn install`
- Start development server `npm run dev` or `yarn dev`
- Follow instruction on terminal to open app in the browser

# Architerure

- This React app was created using Vite and Typescript.
- Redux is used for state management, and a React DnD is used to drag and drop. 
- In order to use this functionality, two providers wrap main.tsx - Redux Provider and DnD Provider.
- Tailwind is used for styling.
- The application is structured in such a way that the main functionality is divided into components, some functions are taken out into services, and the main functionality for working with data is divided into working with folders and working with files - `folder-slice.ts` and `media-slice.ts`.
- This application allows you to filter data by type (video, image or gif) and filter it by name. It is possible to move files from one folder to another, rename and delete files. Also, with the help of the DnD library, you can drag and drop files from one folder to another.

# Limitations

- From the point of view of limitations, I can mention that the data is not saved when the tab is reloaded, a potential solution is to save the selections, interaction results in the local storage or on the backend side.
- Also, we always take the same set of data and the page does not provide pagination. 
- The media type is not dynamic but a static type, which provides only images, videos and gifs.
- Some styles can be improved and error handling can be tackled more efficient.

# Steps to improve

From the point of view of improvement so that the application can be rolled out
- it is necessary to improve the hierarchy of folders and add functionality to create new folders;
- it is necessary to make the application more suitable for working on different types of devices (mobile, web, desktop version);
- it is necessary to work with the optimization of component rendering;
- add pagination;
- set up a better testing structure, for example, add component tests such as Cypress;
