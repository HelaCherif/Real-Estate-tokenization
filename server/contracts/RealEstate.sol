pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";


contract RealEstate is Ownable, ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _propertyId;

    struct Property {
        uint id;
        uint256 tokenNumber;
        uint256 postalCode;
        uint256 annualYield;
        uint256 price;
        bool isPublished;
        string name;
        string addr;
        string city;
        string complementAddress;
        string description;
    }

    struct Token {
        uint tokenId;
        address addr;
        string name;
        uint propertyId;
        string url;
    }

    constructor() ERC721("RealEstate", "RealEstate") payable {}


    Property[] public allProperties;
    Token[] public allTokens;
    mapping(address => Token[]) public clients;
    uint256 public constant MAX_MINT_PER_TX = 10;
    //owner of NFT Token and Marketplace are same.
    address nftMarketAddress; //address of the NFT marketplace


    event PropertyAdded(uint id, string name, uint price, string addr, uint tokenNumber);
    event PropertyUpdated(uint id, string name, uint price, string addr, uint tokenNumber);
    event PropertyDeleted(uint id);
    event PropertyPublished(uint id);
    event MintToken(address indexed _to, uint256 quantity,uint tokenId);
    event Mint(address indexed _to, uint256 quantity);

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://ipfs.io/ipfs/QmSrSwboxekwhUfK5nKcbzK6xuTmNxhsiz643pmjqJfqPt/";
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    fallback() external payable {
        // custom function code
    }

    receive() external payable {
        // custom function code
    }

    function addProperty(Property memory _property) external onlyOwner {
        require(keccak256(abi.encode(_property.name)) != keccak256(abi.encode("")), 'The name of the property is mandatory');
        _property.id = _propertyId.current();
        allProperties.push(_property);
        _propertyId.increment();
        emit PropertyAdded(_property.id, _property.name, _property.price, _property.addr, _property.tokenNumber);
    }

    function deleteProperty(uint256 _id) external onlyOwner {
        delete allProperties[_id];
        emit PropertyDeleted(_id);
    }

    function updateProperty(Property memory _property) external onlyOwner {
        allProperties[_property.id] = _property;
        emit PropertyUpdated(_property.id, _property.name, _property.price, _property.addr, _property.tokenNumber);
    }

    function publishProperty(uint256 _id) external onlyOwner {
        allProperties[_id].isPublished = true;
        emit PropertyPublished(_id);
    }

    function mintNFTProperty(uint256 _propertyId) payable external onlyOwner {
        require(allProperties[_propertyId].isPublished, "The property is not published yet");
        Property memory property = allProperties[_propertyId];
        for (uint i = 0; i < property.tokenNumber; i++) {
            _safeMint(msg.sender, _tokenIds.current());
            //setTokenMetadata(_tokenIds.current(), "NFT" , baseURI());
            allTokens.push(Token(_tokenIds.current(), msg.sender, "NFT",_propertyId, baseURI()));
            emit MintToken(msg.sender, property.tokenNumber,_tokenIds.current());
            _tokenIds.increment();
            setApprovalForAll(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, true);
        }

        emit Mint(msg.sender, property.tokenNumber);
    }

    // Transfers ERC721 token from the caller's address to another address
    function transferTo(address _to, uint256 _tokenId) public payable {
        Token memory token = allTokens[_tokenId];
        Property memory property = allProperties[token.propertyId];
        require(msg.value >= property.price , "Insufficient Funds");
        approve(_to, _tokenId);
        safeTransferFrom(msg.sender, _to, _tokenId, "0x");
        allTokens[_tokenId].addr=_to;
        token.addr=_to;
        clients[_to].push(token);
    }

    function setTokenMetadata(
        uint256 tokenId,
        string memory name,
        string memory url
    ) internal {
        allTokens[tokenId] = Token(tokenId,msg.sender,name,1, url);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721)
    returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        allTokens[tokenId].name,
                        '",',
                        '"image_data": "',
                        allTokens[tokenId].url,
                        '",',
                        '"attributes": [{"trait_type": "Speed", "value": ',
                        "5",
                        "},",
                        '{"trait_type": "Attack", "value": ',
                        "2",
                        "},",
                        '{"trait_type": "Defence", "value": ',
                        "3",
                        "},",
                        '{"trait_type": "Material", "value": "',
                        "4",
                        '"}',
                        "]}"
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }


}