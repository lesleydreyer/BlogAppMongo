
/*var blogTemplate = (
  '<div class="blogPost js-blogPost">' +
    '<h3 class="js-blogTitle"></h3>' +
    //'<h2 class="blog-title" data-title="'+post.title+'">'+post.title+'</h2>'+
    '<hr>' +
    '<p class="js-blogContent">' +
    '<br />' + 
    '<span class="js-blogAuthor></span> &nbsp; &nbsp;' +
    '<span class="js-blogDate"></span>' +
    '</p>' +
    '<div class="blogControls">' +
      '<button class="js-blogPost-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
      '<button class="js-blogPost-update">' +
        '<span class="button-label">update</span>' +
      '</button>' +     
    '</div>' +
  '</div>'
);*/


var BLOGPOSTS_URL = '/blog-posts';



function getAndDisplayBlogPosts() {
  console.log('Retrieving posts');
  $.getJSON(BLOGPOSTS_URL, function(posts) {
    console.log('Rendering blog posts');
    var blogPostsElement = posts.map(function(post) {
      var element = $(blogTemplate);
      element.attr('id', post.id);
      var postTitle = element.find('.js-blogTitle');
      postTitle.text(post.title);
      var postContent = element.find('.js-blogContent');
      postContent.text(post.content);
      var postAuthor = element.find('.js-blogAuthor');
      postAuthor.text(post.author);
      var postDate = element.find('.js-blogDate');
      postDate.text(post.publishDate);
     // });
     console.log(postAuthor);
     console.log(postAuthor.text);
      return element;
    });
    //console.log(blogPostsElement.stringify);
    blogPostsElement.forEach(function(post){
      $('body').append('<div class="blogPost js-blogPost">' +
    '<h3 class="js-blogTitle" data-title="'+post.title+'">'+post.title+'</h3>' +
    '<hr>' +
    '<p class="js-blogContent" data-content="'+post.content+'">'+post.content+' <br />' + 
    '<span class="js-blogAuthor" data-author="'+post.author+'">'+post.author+'</span> &nbsp; &nbsp;' +
    '<span class="js-blogDate" data-publishDate="'+post.publishDate+'">'+post.publishDate+'</span>' +
    '</p>' +
    '<div class="blogControls">' +
      '<button class="js-blogPost-delete delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
      '<button class="js-blogPost-update update">' +
        '<span class="button-label">update</span>' +
      '</button>' +     
    '</div>' +
  '</div>');
  ///////////////////////////////////   
    });


    //$('.js-blogs').html(blogPostsElement);
    });
}



function addPost(post) {
  console.log('Adding blog: ' + post);
  $.ajax({
    method: 'POST',
    url: BLOGPOSTS_URL,
    data: JSON.stringify(post),
    success: function(data) {
      getAndDisplayBlogPosts();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}


function deletePost(postID) {
  console.log('Deleting blog `' + postID + '`');
  $.ajax({
    url: BLOGPOSTS_URL + '/' + postID,
    method: 'DELETE',
    success: getAndDisplayBlogPosts
  });
}



function updatePost(post) {
  console.log('Updating blog `' + post.id + '`');
  $.ajax({
    url: BLOGPOSTS_URL + '/' + post.id,
    method: 'PUT',
    data: post,
    success: function(data) {
        getAndDisplayBlogPosts();
    }
  });
}




function handleBlogPostAdd() {
  $('#js-blog-form').submit(function(e) {
    e.preventDefault();
    addPost({
      title: $(e.currentTarget).find('#blogTitle').val(),
      content: $(e.currentTarget).find('#blogContent').val(),
      author: $(e.currentTarget).find('#blogAuthor').val(),
      publishDate: $(e.currentTarget).find('#blogDate').val()
    });
  });
}



function handleBlogPostDelete() {
  $('.js-blogs').on('click', '.js-blogPost-delete', function(e) {
    e.preventDefault();
    deletePost(
      $(e.currentTarget).closest('.js-blogPost').attr('id'));
  });
}

function handleBlogPostUpdate(){
  //$('.update').click(function(){
  $('.js-blogs').on('click', '.js-blogPost-update', function(e) { 
    var title = $(this).parent().children('.js-blogTitle').attr('data-title');
    var content = $(this).parent().children('.js-blogContent').attr('data-content');
    var author = $(this).parent().children('.js-blogAuthor').attr('data-author');
    var publishDate = $(this).parent().children('.js-blogDate').attr('data-publishDate');
    $('#blogTitle').val(title);
    $('#blogContent').val(content);
    $('#blogAuthor').val(author);
    $('#blogDate').val(publishDate);
    $('form input#submit').val('Update Post');
    $('form').removeClass('new-post').addClass('edit-post');
      
    updatePost({
        title: $(e.currentTarget).find('#blogTitle').val(),
        content: $(e.currentTarget).find('#blogContent').val(),
        author: $(e.currentTarget).find('#blogAuthor').val(),
        publishDate: $(e.currentTarget).find('#blogDate').val()
      });
    });
  }
  

$(function() {
  getAndDisplayBlogPosts();
  //handleBlogPostAdd();
  handleBlogPostDelete();
  //handleBlogPostUpdate();


  /////////////////////////////rework this below
  //$('form').submit(function(e){
    e.preventDefault();
    if($(this).hasClass('new-post')){
      // new post code
      handleBlogPostAdd();
    } else {
      // edit post code
      handleBlogPostUpdate();
    }
    $(this).removeClass('edit-post').addClass('new-post');
    $('form')[0].reset();
    $('form input#submit').val('Add Post');
 // })


});