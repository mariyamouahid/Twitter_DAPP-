// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MiniSocial {
    // Structure for a Post with additional fields
    struct Post {
        string message;
        address author;
        uint likeCount;
        uint commentCount;
        uint256 createdAt;      // Timestamp of creation
        uint256 modifiedAt;     // Timestamp of modification
        bool isModified;        // Indicator of modification
        bool exists;            // Indicator of existence
    }

    struct Comment {
        string message;
        address commenter;
        uint likeCount;
        uint256 createdAt;      // Timestamp of creation
        bool exists;
    }

    // State variables
    Post[] public posts;
    mapping(uint => mapping(address => bool)) public postLikes;
    mapping(uint => Comment[]) public postComments;
    mapping(uint => mapping(uint => mapping(address => bool))) public commentLikes;
    
    // Delegation mapping
    mapping(address => address) public delegates; // delegatee -> delegator

    // Events for the front-end
    event PostCreated(uint indexed postId, address indexed author, string message, uint256 timestamp);
    event PostModified(uint indexed postId, string newMessage, uint256 timestamp);
    event PostLiked(uint indexed postId, address indexed liker);
    event PostUnliked(uint indexed postId, address indexed unliker);
    event CommentAdded(uint indexed postId, uint indexed commentId, address commenter);
    event DelegationSet(address indexed delegator, address indexed delegatee);
    event DelegationRevoked(address indexed delegator, address indexed delegatee);

    // Modifier to check post author ownership
    modifier onlyPostAuthor(uint _postId) {
        require(_postId < posts.length, "Post does not exist");
        require(posts[_postId].exists, "Post has been deleted");
        require(
            posts[_postId].author == msg.sender || delegates[msg.sender] == posts[_postId].author,
            "You are not the author or authorized by the author"
        );
        _;
    }

    // Set delegation to allow another address to act on behalf of msg.sender
    function setDelegate(address _delegatee) public {
        require(_delegatee != msg.sender, "Cannot delegate to yourself");
        delegates[_delegatee] = msg.sender;
        emit DelegationSet(msg.sender, _delegatee);
    }

    // Revoke the delegation
    function revokeDelegate() public {
        require(delegates[msg.sender] != address(0), "No delegation found to revoke");
        address delegator = delegates[msg.sender];
        delegates[msg.sender] = address(0);
        emit DelegationRevoked(delegator, msg.sender);
    }

    // Publish a new post
    function publishPost(string memory _message) public {
        posts.push(Post({
            message: _message,
            author: msg.sender,
            likeCount: 0,
            commentCount: 0,
            createdAt: block.timestamp,
            modifiedAt: block.timestamp,
            isModified: false,
            exists: true
        }));
        
        emit PostCreated(posts.length - 1, msg.sender, _message, block.timestamp);
    }

    // Modify an existing post
    function modifyPost(uint _postId, string memory _newMessage) public onlyPostAuthor(_postId) {
        Post storage post = posts[_postId];
        post.message = _newMessage;
        post.modifiedAt = block.timestamp;
        post.isModified = true;
        
        emit PostModified(_postId, _newMessage, block.timestamp);
    }

    // Like a post
    function likePost(uint _postId) public {
        require(_postId < posts.length, "Post does not exist");
        require(posts[_postId].exists, "Post has been deleted");
        require(!postLikes[_postId][msg.sender], "You have already liked this post");

        postLikes[_postId][msg.sender] = true;
        posts[_postId].likeCount++;
        
        emit PostLiked(_postId, msg.sender);
    }

    // Unlike a post
    function unlikePost(uint _postId) public {
        require(_postId < posts.length, "Post does not exist");
        require(posts[_postId].exists, "Post has been deleted");
        require(postLikes[_postId][msg.sender], "You haven't liked this post");

        postLikes[_postId][msg.sender] = false;
        posts[_postId].likeCount--;
        
        emit PostUnliked(_postId, msg.sender);
    }

    // Add a comment to a post
    function addComment(uint _postId, string memory _message) public {
        require(_postId < posts.length, "Post does not exist");
        require(posts[_postId].exists, "Post has been deleted");

        uint commentId = postComments[_postId].length;
        postComments[_postId].push(Comment({
            message: _message,
            commenter: msg.sender,
            likeCount: 0,
            createdAt: block.timestamp,
            exists: true
        }));
        posts[_postId].commentCount++;
        
        emit CommentAdded(_postId, commentId, msg.sender);
    }

    // Retrieve a post's full details
    function getPost(uint _postId) public view returns (
        string memory message,
        address author,
        uint likeCount,
        uint commentCount,
        uint256 createdAt,
        uint256 modifiedAt,
        bool isModified,
        bool exists
    ) {
        require(_postId < posts.length, "Post does not exist");
        Post storage post = posts[_postId];
        return (
            post.message,
            post.author,
            post.likeCount,
            post.commentCount,
            post.createdAt,
            post.modifiedAt,
            post.isModified,
            post.exists
        );
    }

    // Check if a user has liked a post
    function hasLikedPost(uint _postId, address user) public view returns (bool) {
        require(_postId < posts.length, "Post does not exist");
        return postLikes[_postId][user];
    }

    // Retrieve the total number of posts
    function getTotalPosts() public view returns (uint) {
        return posts.length;
    }

    // Retrieve recent posts with pagination
    function getRecentPosts(uint start, uint limit) public view returns (Post[] memory) {
        require(start < posts.length, "Start index out of bounds");
        
        uint count = 0;
        for (uint i = start; i < posts.length && count < limit; i++) {
            if (posts[i].exists) {
                count++;
            }
        }
        
        Post[] memory recentPosts = new Post[](count);
        uint currentIndex = 0;
        
        for (uint i = start; i < posts.length && currentIndex < count; i++) {
            if (posts[i].exists) {
                recentPosts[currentIndex] = posts[i];
                currentIndex++;
            }
        }
        
        return recentPosts;
    }
}
