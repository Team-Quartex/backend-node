import { db } from "../conect.js";
import { english } from "../resource/english.js";
import jwt from "jsonwebtoken";
import {formatPostTime} from '../resource/timeformat.js'

// Function to get post tags
function getPostTags(callback) {
  const q = `SELECT description FROM posts`;
  db.query(q, (err, data) => {
    if (err) return callback(err, null);
    callback(null, data); // Pass the data to the callback
  });
}

// Function to get all profiles
function getAllProfile(callback) {
  const q = `SELECT 
                    u.*, 
                    COUNT(p.postId) AS post_count
                FROM 
                    users AS u
                LEFT JOIN 
                    posts AS p 
                ON 
                    p.userId = u.userid
                GROUP BY 
                    u.userid;`;

  db.query(q, (err, data) => {
    if (err) return callback(err, null);

    // Map the user data to the desired format
    const mappedUsers = data.map((user, index) => ({
      id: user.userid, // Unique ID
      type: "profile", // Type field (if required)
      name: user.name, // User's name from the database
      image: user.profilepic, // Placeholder image
      content: `Total Posts ${user.post_count}`, // Content field based on user data
    }));

    callback(null, mappedUsers); // Pass the mapped data to the callback
  });
}

function getTopWords(callback) {
  getPostTags((err, posts) => {
    if (err) return callback(err, null);

    // Word frequency analysis
    const wordFrequency = {}; // Object to store word frequencies

    // Iterate through posts
    posts.forEach((post) => {
      const words = post.description
        .toLowerCase()
        .split(/\s+/) // Split by whitespace
        .filter(
          (word) => Boolean(word) && !english.includes(word) && isNaN(word)
        ); // Filter common words and numbers

      // Count frequencies
      words.forEach((word) => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });

    // Sort and map the results
    const sortedWords = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a) // Sort by frequency descending
      .map(([word]) => word);

    const mappedWords = sortedWords.map((word, index) => ({
      id: `word-${index}`, // Unique ID
      type: "post",
      name: word, // The word
      image: `https://via.placeholder.com/50?text=${word
        .charAt(0)
        .toUpperCase()}`, // Placeholder image
      content: `This is content related to the word "${word}"`, // Example content
    }));

    callback(null, mappedWords); // Pass the final data to the callback
  });
}

// Main search handler
export const getSearch1 = (req, res) => {
  getAllProfile((err, profileData) => {
    if (err) return res.status(500).json({ error: err.message });

    getPostTags((err, postTagsData) => {
      if (err) return res.status(500).json({ error: err.message });

      // Combine or return the data you need
      
      return res.status(200).json({
        profiles: profileData,
        postTags: postTagsData,
      });
    });
  });
};
export const getSearch = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    getTopWords((err, tags) => {
      if (err) return res.status(500).json({ error: err.message });

      getAllProfile((err, profiles) => {
        if (err) return res.status(500).json({ error: err.message });

        // Concatenate the two arrays
        const combinedArray = [...tags, ...profiles];

        // Shuffle the array
        const shuffledArray = combinedArray.sort(() => Math.random() - 0.5);

        // Return the result
        return res.status(200).json({
          data: shuffledArray,
        });
      });
    });
  });
};


function getSearchResQuery(id,search, callback) {
  const q = `
    SELECT 
    p.*, 
    u.userid AS UserId, 
    u.name, 
    u.profilePic,
    u.verify,
    COUNT(pc.postId) AS comments,
    GROUP_CONCAT(DISTINCT pl.userId) AS likeduser, -- Ensure unique user IDs
    GROUP_CONCAT(pi.imageLink) AS images,
    CASE 
        WHEN uf.folowing_by IS NOT NULL THEN 'yes'
        ELSE 'no'
    END AS isFollowed,
CASE WHEN sp.userId IS NOT NULL THEN 'yes' ELSE 'no' END AS isSaved
FROM posts AS p
JOIN users AS u ON u.userid = p.userId
LEFT JOIN post_image AS pi ON pi.postId = p.postId
LEFT JOIN post_likes AS pl ON pl.postId = p.postId
LEFT JOIN post_comments AS pc ON pc.postId = p.postId
LEFT JOIN 
    user_follows AS uf ON uf.follow = u.userid AND uf.folowing_by = ?
LEFT JOIN saved_posts AS sp ON sp.postId = p.postId AND sp.userId = ?
WHERE p.description LIKE ? OR p.location = ? 
GROUP BY p.postId, u.userid
ORDER BY p.postTime DESC

  `;
  const searchTerm = `%${search}%`;

  db.query(q, [id,id,searchTerm,searchTerm], (err, data) => {
    if (err) return callback(err);
    const formattedData = data.map((post) => ({
      ...post,
      images: post.images ? post.images.split(",") : [], // Transform images into an array
      likeduser: post.likeduser ? post.likeduser.split(",") : [], // Transform likeduser into an array
      postTime: formatPostTime(post.postTime),
    }));
    callback(null, formattedData);
  });
}

export const getSearchres = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    getSearchResQuery(userInfo.id,req.query.search,(err,data)=>{
      if (err) return res.status(500).json(err);
      return res.status(200).json({
        data: data,
      })
    })
    
  });
};

