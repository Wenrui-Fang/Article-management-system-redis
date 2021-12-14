

# Article management system(MongoDB and Redis)

Jinxin Hu:

	Completed the sign-up and log-in part;
	
	Completed other auxiliary functions like getting user basic information and updating password;
	
	Build art_ranking page for find the number of articles filter by category（give the top 10 categories which have the most articles) by using redis sorted set;

Wenrui Fang:

	Wrote the page of homepage part;
	
	Wrote the code of article category, article list and article deleting parts;
	
	Build newest_articles page for filter articles by publication date(Sort by release time to find the top 20 articles) by using redis hashmap;

The diagram on the homepage is not the content of this project. It is just a sample display.

## User Story

David wants to have a platform where he can record and publish his thoughts. He can record the knowledge he learns in his life, the news he hears about and his views on these things in this article management system. The article management system needs to have the function of classification retrieval. David can also add new categories he wants so that he can choose to publish the article to the appropriate category.

## Business Requirements

Users can register a new account.

The user should log in to the account.

Users can add the article category they want to publish.

Users can post articles.

Users can view their basic information.

The user can set up and change the profile photo.

Users can reset their own password.

Article needs to have an author

Articles need to have at least one classification

Article needs to have a title

The article needs to have a body

Articles can be published

The article can have a cover image

The article category needs to have an alias

**Nouns**: Users , Articles,  Article Category

**Verbs**: record, publish

**Attribs**: Users(username, password, nickname, email, profile photo), Article Category(name, alias), Articles(title, content, cover image, publication date, status)

## Conceptual Model(UML)

![uml_project1](./picture/uml_project1.png)



## Redis data structures

To implement the most articles category I will use a Redis sorted set with key "leaderboard", Category name as the values and a score of the number of articles of the category.

To implement the newest articles I will use a Redis HashMap with key "newestArticles:count", title, category,pubDate,status as the values.

## How to Start

Download and install [MongoDB](https://docs.mongodb.com/manual/installation/) follow this instruction

Import the file using mongoimport

```
mongoimport --db articleSystem --collection category --file article.json --jsonArray   
mongoimport --db articleSystem --collection category --file articles.json --jsonArray   
mongoimport --db articleSystem --collection category --file category.json --jsonArray   
mongoimport --db articleSystem --collection category --file user.json --jsonArray   
```

Download nodejs and install

Download link: https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi

Download main from https://github.com/hujinxinchengdu/Article-management-system

For backend first of all go the backend folder

```
cd backend
```


Open the console and enter commands to install related dependencies

```
npm install
```

Enter the following command in the vscode console:

```
nodemon app.js
```

If do not have nodemon you should install it by following command

```
npm install -g nodemon
```

For Frontend using vscode live sever--run server using login.html

https://www.youtube.com/watch?v=7xchuqcsncY
