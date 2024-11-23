-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 20, 2024 at 04:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trova_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `description` varchar(2500) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `postTime` timestamp NULL DEFAULT current_timestamp(),
  `approval` varchar(10) NOT NULL DEFAULT 'not'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`postId`, `userId`, `description`, `location`, `postTime`, `approval`) VALUES
(1, 1, 'Sigiriya, often referred to as the \"Lion Rock,\" is an ancient rock fortress and UNESCO World Heritage Site located in the central Matale District of Sri Lanka. It is located between Dambulla and Habarane and is one of the most visited tourist destinations in Sri Lanka. Rising dramatically from the surrounding plains, Sigiriya is a colossal rock formation standing around 200 meters tall. Its sheer vertical walls and flattened summit once served as a fortified royal citadel. \n\nSigiriya dates back to the 5th century AD when King Kashyapa chose this site as his capital and built a magnificent palace atop the rock. The fortress was abandoned after his death and transformed into a Buddhist monastery. There is a huge gateway shaped like a lion, and the place derives its name from this gateway. The rock fortress showcases the advanced engineering and architectural prowess of ancient Sri Lankan civilization.\n\nThe remnants of the palace complex, including water gardens, frescoes, and the famous Lion Gate, depict the grandeur of its past. The highlight of the fortress is the colorful frescoes painted on the western face of the rock; it is believed that there were initially 500 such frescoes, but merely around 22 of them remain today. Another highlight is the Mirror Wall, a polished surface that once displayed reflective qualities and now bears ancient inscriptions and graffiti.\n\nThe gigantic Lion’s Paws greet visitors before the summit. At the peak are the ruins of the royal palace of King Kashyapa I and 360-degree panoramas of the surrounding landscape. Sigiriya Museum at the foot of the rock has a plethora of artifacts related to Sigiriya on display for visitors seeking information regarding the site’s history. Ascending the rock involves climbing steep staircases and pathways, culminating in the Lion Platform. The rock fortress is surrounded by beautifully landscaped water gardens, reservoirs, and irrigation systems. Sigiriya stands as a testament to ancient Sri Lankan ingenuity and artistry, offering a captivating glimpse into the island\'s rich cultural heritage. It is a must-visit destination for history enthusiasts, archaeologists, and travelers seeking an unforgettable cultural experience.', '123fddffdsdfdsfdsfghjgfdsffdfdsfds456', '2024-11-18 11:47:10', 'not'),
(2, 1, 'Introduction to Madulsima\n\nMadulsima is a village situated in the Uva province of Sri Lanka. It is a picturesque village with mountains popular for hiking and camping. One such popular attraction is the Madulsima Mini World’s End which is a famous hiking spot of the area. Many adventurers also enjoy camping above the clouds during their hikes at Madulsima.\n\nBeauty of Madulsima\n\nMadlsima Mountain has an elevation of 383 m and stands approximately 700 – 1000 m above sea level. The highest part of the mountain belongs to Roeberry Estate. The Madulsima Mini World’s End which is also known as the Pitamaruwa Mini World’s End is located at the end of this estate. Madulsima is a heavenly location which stands high above in elevation and is mostly shrouded by the mist and feels as if one is travelling among the clouds. Kalugala, which is a popular hiking spot, is located on the northern point of the Madulsima mountain range.', '123fddffdsdfdsfdsfghjgfdsffdfdsfds456', '2024-11-18 11:49:28', 'not'),
(3, 1, 'An early start to this place is important weather and temperature wise. The hike takes you on a circular path through the plains and the view of the countryside is beautiful. The vegetation is unique and you get to see many rare highland birds. A good hike and worth it too.', '123fddffdsdfdsfdsfghjgfdsffdfdsfds456', '2024-11-18 11:56:35', 'not'),
(4, 1, 'An early start to this place is important weather and temperature wise. The hike takes you on a circular path through the plains and the view of the countryside is beautiful. The vegetation is unique and you get to see many rare highland birds.  #inida @sriLanka', '123fddffdsdfdsfdsfghjgfdsffdfdsfds456', '2024-11-18 13:50:44', 'not'),
(5, 2, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.', '123fddffdsdfdsfdsfghjgfdsffdfdsfds456', '2024-11-18 17:46:17', 'not'),
(6, 2, 'nice sri lanka', 'Sigiriya', '2024-11-19 06:31:10', 'not'),
(7, 2, 'sri lanka matha', '', '2024-11-19 06:34:39', 'not'),
(8, 3, 'Hello mage raththaran yaluwaneee ? Kawada bng', 'Ja-Ela', '2024-11-19 08:19:08', 'not');

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `commenId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `createat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_image`
--

CREATE TABLE `post_image` (
  `postId` int(11) NOT NULL,
  `imageLink` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_image`
--

INSERT INTO `post_image` (`postId`, `imageLink`) VALUES
(1, '1-1731930430283-SIGIRIYA.jpg'),
(2, '2-1731930568680-Madulsima (3).jpg'),
(3, '3-1731930995514-img-20180227-161024-707.jpg'),
(3, '4-1731930995516-img-20180227-161740-552.jpg'),
(3, '5-1731930995518-waterfall.jpg'),
(3, '6-1731930995519-scenery.jpg'),
(6, '1-1731997870122-SIGIRIYA.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `sellerId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `location` varchar(45) NOT NULL,
  `price` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `postAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `sellerId`, `name`, `description`, `location`, `price`, `qty`, `status`, `postAt`, `categoryId`) VALUES
(1, 1, 'Tent', 'Spacious 4-person tent for camping', 'Colombo', 15, 10, 'available', '2024-11-20 02:47:48', 1),
(2, 2, 'Sleeping Bag', 'Warm and waterproof sleeping bag', 'Kandy', 8, 20, 'available', '2024-11-20 02:47:48', 2),
(3, 3, 'Backpack', '50L lightweight backpack for trekking', 'Galle', 12, 15, 'available', '2024-11-20 02:47:48', 3),
(4, 1, 'Portable Stove', 'Compact portable gas stove', 'Nuwara Eliya', 10, 5, 'available', '2024-11-20 02:47:48', 1),
(5, 2, 'Camping Chair', 'Foldable and lightweight camping chair', 'Colombo', 6, 25, 'available', '2024-11-20 02:47:48', 5),
(6, 3, 'GoPro Camera', 'Waterproof action camera for adventure', 'Ella', 25, 3, 'available', '2024-11-20 02:47:48', 1),
(7, 1, 'Bike Rack', 'Car-mounted bike rack for 2 bicycles', 'Negombo', 18, 4, 'available', '2024-11-20 02:47:48', 1),
(8, 2, 'Portable Cooler', 'Cooler box for drinks and snacks', 'Arugam Bay', 14, 7, 'available', '2024-11-20 02:47:48', 4),
(9, 3, 'Fishing Rod', 'Durable fishing rod for lake fishing', 'Trincomalee', 10, 10, 'available', '2024-11-20 02:47:48', 4),
(10, 1, 'Hiking Shoes', 'Waterproof and durable hiking shoes', 'Hatton', 20, 8, 'available', '2024-11-20 02:47:48', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(100) NOT NULL,
  `image` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`categoryId`, `categoryName`, `image`) VALUES
(1, 'Tent', 'test1.png'),
(2, 'Tent', 'test1.png'),
(3, 'Tent', 'test1.png'),
(4, 'Tent', 'test1.png'),
(5, 'Camera', 'test1.png'),
(6, 'Glouse', 'test1.png'),
(7, 'Gas', 'test1.png');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `productId` int(11) NOT NULL,
  `imageLink` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `reviewId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `reviewRate` double NOT NULL,
  `review_content` varchar(250) NOT NULL,
  `availibility` varchar(45) NOT NULL,
  `reviewtime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `reservationId` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `orderTime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_posts`
--

CREATE TABLE `saved_posts` (
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saved_posts`
--

INSERT INTO `saved_posts` (`userId`, `postId`) VALUES
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sellers`
--

CREATE TABLE `sellers` (
  `sid` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `business_name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `city` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `status` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sellers`
--

INSERT INTO `sellers` (`sid`, `name`, `business_name`, `email`, `address`, `city`, `username`, `password`, `status`) VALUES
(1, 'Hansaka Ravisha', 'Inner pvt ltd', 'innertravel@gmail.com', '', '', 'inner@gmail.com', '12345', 'active'),
(2, 'Rasaja Perirs', 'Inner21 pvt ltd', 'innertrave21l@gmail.com', '', '', 'inner21', '12345', 'active'),
(3, 'Kavishka', 'In2121ner pvt ltd', 'innertrav2121el@gmail.com', '', '', 'inner2212121@gmail.com', '123425', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(300) NOT NULL,
  `name` varchar(45) NOT NULL,
  `profilepic` varchar(200) DEFAULT 'sample.png',
  `verify` varchar(10) NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `username`, `email`, `password`, `name`, `profilepic`, `verify`) VALUES
(1, 'hansaka2002', 'hansakaravi02@gmail.com', '$2a$10$jWyiDf8ENWll3Fj1fnRYhOPmSwTdREHxxGHBGAJ1248W0FXO3myZ6', 'Hansaka', 'shan4.jpg', 'yes'),
(2, 'rehan2003', 'rehan@gmail.com', '$2a$10$VN9I36BClT.rF6r8vP6JRON5fofbWcRWGvRJ9ucNyL8OVQNC7WyLu', 'rehan2003', 'sample.png', 'yes'),
(3, 'avishka2003', 'avishka@gmail.com', '$2a$10$RQQaD1S.wm1RJovPHec6Zu.CfpAz.RDJ5BXDGxTXvyLLF21yvgkDu', 'avishka Lakshan', 'sample.png', 'yes'),
(4, 'kavee2002', 'kavee@gmail.com', '$2a$10$seTlfO6SjvpHNrMzPUDBQeoERvU0rNLUXTpTfakqYUZsDfTyR2oQq', 'kaveesha Udani', 'sample.png', 'no'),
(5, 'nisha2002', 'nisha@gmail.com', '$2a$10$mmgvCIVUPt.3sIfzRBEAXOJax93616z7icICM0OsK9e15tOpIG572', 'Nishadi Supurnima', 'sample.png', 'no'),
(6, 'wasana2002', 'wasu@gmail.com', '$2a$10$6dML3ixg1TX43j3C1F1b0uHWvIVfw28x/Ki0ZS2T6LnG.n4F7BO5C', 'wasu', 'sample.png', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `user_follows`
--

CREATE TABLE `user_follows` (
  `follow` int(11) NOT NULL,
  `folowing_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_follows`
--

INSERT INTO `user_follows` (`follow`, `folowing_by`) VALUES
(1, 2),
(1, 4),
(2, 1),
(2, 4),
(3, 1),
(3, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postId`,`userId`),
  ADD UNIQUE KEY `postId_UNIQUE` (`postId`),
  ADD KEY `postuserId_idx` (`userId`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`commenId`,`postId`,`userID`),
  ADD UNIQUE KEY `commenId_UNIQUE` (`commenId`),
  ADD KEY `comentedUser_idx` (`userID`),
  ADD KEY `comntedPost_idx` (`postId`);

--
-- Indexes for table `post_image`
--
ALTER TABLE `post_image`
  ADD PRIMARY KEY (`postId`,`imageLink`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`postId`,`userId`),
  ADD KEY `likedUser_idx` (`userId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`,`sellerId`),
  ADD UNIQUE KEY `productId_UNIQUE` (`productId`),
  ADD KEY `sellerproduct_idx` (`sellerId`),
  ADD KEY `productCategory_idx` (`categoryId`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`categoryId`),
  ADD UNIQUE KEY `categoryId_UNIQUE` (`categoryId`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`productId`,`imageLink`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`reviewId`),
  ADD KEY `reviewProduct_idx` (`productId`),
  ADD KEY `reviewUser_idx` (`userid`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservationId`),
  ADD UNIQUE KEY `orderId_UNIQUE` (`reservationId`),
  ADD KEY `reservationproduct_idx` (`productId`),
  ADD KEY `reservationUser_idx` (`userId`);

--
-- Indexes for table `saved_posts`
--
ALTER TABLE `saved_posts`
  ADD PRIMARY KEY (`userId`,`postId`),
  ADD KEY `savedPost_idx` (`postId`);

--
-- Indexes for table `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`sid`),
  ADD UNIQUE KEY `sid_UNIQUE` (`sid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `userid_UNIQUE` (`userid`);

--
-- Indexes for table `user_follows`
--
ALTER TABLE `user_follows`
  ADD PRIMARY KEY (`follow`,`folowing_by`),
  ADD KEY `followfrom_idx` (`folowing_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `postId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `commenId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `reviewId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sellers`
--
ALTER TABLE `sellers`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `postuserId` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `comentedUser` FOREIGN KEY (`userID`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comntedPost` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_image`
--
ALTER TABLE `post_image`
  ADD CONSTRAINT `postimages` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `likedPost` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `likedUser` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `productCategory` FOREIGN KEY (`categoryId`) REFERENCES `product_category` (`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sellerproduct` FOREIGN KEY (`sellerId`) REFERENCES `sellers` (`sid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `porductImage` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `reviewProduct` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviewUser` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservationUser` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservationproduct` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `saved_posts`
--
ALTER TABLE `saved_posts`
  ADD CONSTRAINT `savedPost` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedUser` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user_follows`
--
ALTER TABLE `user_follows`
  ADD CONSTRAINT `followby` FOREIGN KEY (`follow`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `followfrom` FOREIGN KEY (`folowing_by`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
