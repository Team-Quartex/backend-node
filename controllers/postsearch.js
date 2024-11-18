import { db } from "../conect.js";
import { english } from "../resource/english.js";
import jwt from "jsonwebtoken";

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
      console.log(postTagsData);
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
