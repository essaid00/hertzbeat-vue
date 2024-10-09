# HertzBeat-frontend

HertzBeat is an application to manage systems. Fundamentally to deploy software to computers in an organization.

This project is the frontend (with [Quasar framework](https://quasar.dev/)).

## License

HertzBeat is free software, released under [GNU GPL v3](https://github.com/HertzBeat/HertzBeat-frontend/blob/master/LICENSE).

## Install the dependencies

```bash
yarn
```

### Configure server

Create and .env file. You can take the content of file .env.example as a sample.

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn run lint
```

### i18n

```bash
yarn gettext-extract
yarn gettext-compile
```

### Build the app for production

```bash
quasar build
```

## Screenshots

### Dashboard (light mode)

![Dashboard](https://github.com/HertzBeat/HertzBeat-frontend/blob/master/screenshots/dashboard.png)

### Computers list (dark mode)

![Computers list](https://github.com/HertzBeat/HertzBeat-frontend/blob/master/screenshots/computers_list.png)
