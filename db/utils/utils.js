exports.formatDates = list => {
  list.map(item => {
    const date = item.created_at;
    delete item.created_at;
    item.created_at = new Date(date).toDateString();
  });
  return list;
};

exports.makeRefObj = list => {
  let refObj = {};
  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });

  return refObj;
};
/* 

      Your comment data is currently in the incorrect format and will violate your SQL schema. 

      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      */

exports.formatComments = (comments, articleRef) => {
  let newComments = [...comments];
  return newComments.map(oldComment => {
    const comment = { ...oldComment };
    if (comment.created_by) {
      const name = comment.created_by;
      delete comment.created_by;
      comment.author = name;
    }
    if (comment.belongs_to) {
      const title = comment.belongs_to; //title
      comment.article_id = articleRef[title];
      delete comment.belongs_to;
    }
    if (comment.created_at) {
      const dateCode = comment.created_at;
      comment.created_at = new Date(dateCode).toDateString();
    }

    return comment;
  });
};
