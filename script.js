// Initialize Web3 and contract variables
let web3;
let account;
let contract;

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			}
		],
		"name": "addComment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "commentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "commenter",
				"type": "address"
			}
		],
		"name": "CommentAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegatee",
				"type": "address"
			}
		],
		"name": "DelegationRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegatee",
				"type": "address"
			}
		],
		"name": "DelegationSet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			}
		],
		"name": "likePost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newMessage",
				"type": "string"
			}
		],
		"name": "modifyPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PostCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "liker",
				"type": "address"
			}
		],
		"name": "PostLiked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PostModified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "unliker",
				"type": "address"
			}
		],
		"name": "PostUnliked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			}
		],
		"name": "publishPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revokeDelegate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_delegatee",
				"type": "address"
			}
		],
		"name": "setDelegate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			}
		],
		"name": "unlikePost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "commentLikes",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "delegates",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			}
		],
		"name": "getPost",
		"outputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "likeCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "commentCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "modifiedAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isModified",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getRecentPosts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "message",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "author",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "likeCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "commentCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "modifiedAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isModified",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "exists",
						"type": "bool"
					}
				],
				"internalType": "struct MiniSocial.Post[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalPosts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "hasLikedPost",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "postComments",
		"outputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "commenter",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "likeCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "postLikes",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "posts",
		"outputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "likeCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "commentCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "modifiedAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isModified",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xEb63D671653489B91E653c52a018B63D5095223B';

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = (await web3.eth.getAccounts())[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            alert(`Connecté avec le compte ${account}`);
            loadFeed();
        } catch (error) {
            console.error("Accès au compte refusé.");
        }
    } else {
        alert("Veuillez installer MetaMask.");
    }
}

// Load posts from contract
// Load posts from contract
async function loadFeed() {
    // Ensure feed element exists and is cleared
    const feedElement = document.getElementById("feed");
    if (!feedElement) {
        console.error("Feed element not found.");
        return;
    }
    feedElement.innerHTML = "";

    try {
        const totalPosts = await contract.methods.getTotalPosts().call();

        for (let i = 0; i < totalPosts; i++) {
            const post = await contract.methods.getPost(i).call();
            if (post.exists) {
                displayPost(i, post);
                loadComments(i);  // Load comments for each post
            }
        }
    } catch (error) {
        console.error("Error loading feed:", error);
    }
}


// Add a new post
async function addPost() {
    const message = document.getElementById("postContent").value;
    if (message) {
        await contract.methods.publishPost(message).send({ from: account });
        alert("Post ajouté !");
        loadFeed();
        document.getElementById("postContent").value = "";
    } else {
        alert("Veuillez écrire un message.");
    }
}

function displayPost(postId, post) {
    const postElement = document.createElement("div");
    postElement.className = "post-card";
    postElement.innerHTML = `
        <p><strong>Message:</strong> ${post.message}</p>
        <p class="post-author"><strong>Auteur:</strong> ${post.author}</p>
        <p><strong>Likes:</strong> ${post.likeCount} | <strong>Commentaires:</strong> ${post.commentCount}</p>
        <p class="post-timestamp">Date: ${new Date(post.createdAt * 1000).toLocaleString()}</p>
        <div class="post-actions">
			<button class="action-btn like-btn" onclick="likePost(${postId})">
				<i class="fas fa-thumbs-up"></i> <span class="count">${post.likeCount || 0}</span>
			</button>
			<button class="action-btn dislike-btn" onclick="unlikePost(${postId})">
				<i class="fas fa-thumbs-down"></i> <span class="count">${post.dislikeCount || 0}</span>
			</button>
			${post.author.toLowerCase() === account.toLowerCase() ? `<button class="action-btn edit-btn" onclick="editPost(${postId})"><i class="fas fa-edit"></i> Modifier</button>` : ""}
		</div>

        <div class="comment-section" id="comments-${postId}">
			<h3>Commentaires</h3>
			<div id="comment-list-${postId}"></div>
			<div class="comment-input-container">
				<input type="text" id="commentContent-${postId}" class="comment-input" placeholder="Ajouter un commentaire" />
				<button class="comment-btn" onclick="addComment(${postId})">
					<i class="fas fa-comment"></i> Commenter
				</button>
			</div>
		</div>
    `;
    document.getElementById("feed").appendChild(postElement);
}


// Like a post
async function likePost(postId) {
    await contract.methods.likePost(postId).send({ from: account });
    alert("Vous avez aimé ce post.");
    loadFeed();
}

// Unlike a post
async function unlikePost(postId) {
    await contract.methods.unlikePost(postId).send({ from: account });
    alert("Vous avez disliké ce post.");
    loadFeed();
}

// Edit a post
async function editPost(postId) {
    const newMessage = prompt("Entrez le nouveau message du post:");
    if (newMessage) {
        await contract.methods.modifyPost(postId, newMessage).send({ from: account });
        alert("Post modifié !");
        loadFeed();
    }
}

// Add comment to a post
async function addComment(postId) {
    const commentContent = document.getElementById(`commentContent-${postId}`).value;
    if (commentContent) {
        await contract.methods.addComment(postId, commentContent).send({ from: account });
        alert("Commentaire ajouté !");
        loadComments(postId);
        document.getElementById(`commentContent-${postId}`).value = "";
    } else {
        alert("Veuillez écrire un commentaire.");
    }
}

// Load comments for a post
async function loadComments(postId) {
    const commentList = document.getElementById(`comment-list-${postId}`);
    commentList.innerHTML = "";
    const totalComments = await contract.methods.getTotalComments(postId).call();

    for (let j = 0; j < totalComments; j++) {
        const comment = await contract.methods.getComment(postId, j).call();
        if (comment.exists) {
            const commentElement = document.createElement("div");
            commentElement.className = "comment";
            commentElement.innerHTML = `
                <p><strong>${comment.commenter}</strong>: ${comment.message}</p>
                <p><small>Likes: ${comment.likeCount}</small></p>
            `;
            commentList.appendChild(commentElement);
        }
    }
}

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        account = (await web3.eth.getAccounts())[0];
        contract = new web3.eth.Contract(contractABI, contractAddress);
        loadFeed();
    } else {
        alert("Veuillez installer MetaMask pour interagir avec cette application.");
    }
};

// Set delegate to allow another user to act on behalf of the current account
async function setDelegate() {
    const delegateAddress = document.getElementById("delegateAddress").value;
    if (web3.utils.isAddress(delegateAddress)) {
        try {
            await contract.methods.setDelegate(delegateAddress).send({ from: account });
            alert(`User ${delegateAddress} is now authorized to act on your behalf.`);
        } catch (error) {
            console.error("Error authorizing the user:", error);
        }
    } else {
        alert("Please enter a valid Ethereum address.");
    }
}

// Revoke the delegate's permission
async function revokeDelegate() {
    try {
        await contract.methods.revokeDelegate().send({ from: account });
        alert("Authorization successfully revoked.");
    } catch (error) {
        console.error("Error revoking authorization:", error);
    }
}
