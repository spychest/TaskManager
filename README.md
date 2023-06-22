
# TaskManager
Le TaskManager est un outil de programmation et de gestion de tâches. 
Il est créé dans le cadre d'un test technique mais sera maintenue à jour et se verra 
enrichie de nouvelles features. Il sera également amélioré dans son architecture et les 
images docker utilisées peuvent être amenées à changer.

## Auteur
- [@spychest](https://www.github.com/spychest)


## Stack
**Client:** Bootstrap 5.3, JavaScript Vanilla

**Server:** Symfony 5.4, PHP 8.2, Mercure, Nginx

## Lancer localement
Cloner le projet depuis github à l'aide de git.
```bash
  git clone https://github.com/spychest/TaskManager.git
```
Installer les dépendances à l'aide de composer
```bash
  composer install
```
Lancer les containers docker à l'aide de docker-compose.
```bash
  docker-compose up -d
```
Vous pouvez alors vous rendre sur la landing page http://localhost:81/


## Deploiement
Avec docker, le déploiement sur un serveur est identique au lancement en local. 
Vous devez cependant penser à changer les variables USER, USER_PASSWORD ainsi que 
ROOT_PASSWORD dans le fichier .env. Vous pouvez également changer les ports utilisés 
dans le fichier docker-compose.yaml.

Une fois les modification apportées, lancer les containers docker à l'aide de 
docker-compose.
```bash
  docker-compose up -d
```
Vous pouvez alors vous rendre sur la landing page au port que vous avez choisis.

## Elements appris
En developpant ce projet, j'ai principalement travaillé sur le découpage des 
responsabilités de chaque méthode. J'ai également appris à utiliser Mercure, 
permettant d'avoir un rendu en temps réel pour les utilisateurs.

Le challenge provenait du front en JavaScript Vanilla pour faire des requêtes API et 
traiter les réponses, mais également de la necessité d'avoir un traitement en temps 
réel pour l'ensemble des utilisateurs présent sur la page.

## Optimisations
Un grand nombre d'optimisations on été effectué par rapport au code d'origine.
- Refactorisation du code, tant coté client que coté serveur. 
- Architecture respectant mieux les principes SOLID. 
- Utilisation de nom de variables, méthodes, fonction claire et plus explicite pour limiter la quantité de commentaires.
- Suppression d'anti-pattern (Example: commentaires ne correspondant plus au code présent)

## Roadmap
- Ecriture de tests
- Amélioration de l'esthétique générale
- Mise en place de CI/CD
- Utilisation d'une image php8.2 personnalisé et plus performante
- Mise en place d'une démo d'utilisation


## Feedback
Si vous avez un retour d'expérience à faire, contactez moi à cette adresse jf.pavlic@gmail.com
