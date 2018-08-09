"use strict";

const mongoose = require("mongoose");

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true },
  content: {type: String, required: true },
  author: {
    firstName: String, 
    lastName: String
  },
  publishDate: { type: Date, default: Date.now }
});

//virtuals allow to define properties on object that manipulate 
//properties stored in a database - like creating a readable 
//string for an address

blogPostSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

//instance method available on all instances of model... 
//used to return an abject that only exposes some of the fields from the underlying data
blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    publishDate: this.publishDate
  };
};

//note all instance and virtal properties on schema
//must be defined before making call to .model

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = { BlogPost };