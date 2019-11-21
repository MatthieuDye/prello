# Prello

Prello is an online project management tool.

![Prello logo](client/src/assets/prello_logo.png)

## Travis
[![Build Status](https://travis-ci.org/MatthieuDye/prello.svg?branch=master)](https://travis-ci.org/MatthieuDye/prello)

## Sonar
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=bugs)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=code_smells)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=ncloc)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=security_rating)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=sqale_index)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=MatthieuDye_prello&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=MatthieuDye_prello)

## Links

Deployed app: https://prello-ig.igpolytech.fr

API documentation: https://prello-ig-back.igpolytech.fr/api-docs/

## Team

## Authors

* **Alia CHAWAF** - [aliachawaf](https://github.com/aliachawaf)
* **Matthieu DYE** - [MatthieuDye](https://github.com/MatthieuDye)
* **Marine GARDEISEN** - [Gardeisen](https://github.com/Gardeisen)
* **Rémi GESTIN** - [Remigestin](https://github.com/Remigestin)
* **Nathan GUILLAUD** - [NathanGuillaud](https://github.com/NathanGuillaud)
* **William REGNART** - [williamregnart](https://github.com/williamregnart)

## Getting started

### Requirements

- [MongoDB](https://www.mongodb.com/fr)
- [Node.js](https://nodejs.org/en/)

### Launch

First, run MongoDB.

```shell script
git clone https://github.com/MatthieuDye/prello.git
cd prello
```
On one terminal:
```shell script
cd client
npm install
npm start
```

On a second terminal:
```shell script
cd server
npm install
npm start
```

Your app is now running at the following link: http://localhost:3000/

API documentation is here: http://localhost:5000/api-docs/

### Tests

You can run the tests in /server folder by using the following command: 

```shell script
npm test
```
