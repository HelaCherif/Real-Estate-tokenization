const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const {ethers} = require("hardhat");

const propertyAddress1 = {
    postalCode: 92600,
    addr: "addresse de property1",
    city: "Paris",
    complementAddress: "complement d'adresse1"
}
const financialInfos1 = {
    tokensNumber: 50,
    annualYield: 2,
    propertyPrice: 100000,
    tokenPrice: 2000
}
const financialInfosWithNullTokenNumber = {
    tokensNumber: 0,
    annualYield: 2,
    propertyPrice: 100000,
    tokenPrice: 2000
}
const financialInfosWithNullTokenPrice = {
    tokensNumber: 50,
    annualYield: 2,
    propertyPrice: 0,
    tokenPrice: 110
}
const propertyAddress2 = {
    postalCode: 75000,
    addr: "addresse de property2",
    city: "Paris",
    complementAddress: "complement d'adresse2"
}
const financialInfos2 = {
    tokensNumber: 100,
    annualYield: 2,
    propertyPrice: 500000,
    tokenPrice: 5000
}
const propertyWithoutName = [0, "", "description property1", false, propertyAddress1, financialInfos1]
const propertyWithNullTokenNumber = [0, "property1", "description property1", false, propertyAddress1, financialInfosWithNullTokenNumber]
const propertyWithNullTokenPrice = [0, "property1", "description property1", false, propertyAddress1, financialInfosWithNullTokenPrice]
const property1 = [0, "name property1", "description property12", false, propertyAddress1, financialInfos1]
const property1Updated = [0, "name propertyUpdated1", "description property1", false, propertyAddress1, financialInfos1]
const property2 = [1, "name property2", "description property2", false, propertyAddress2, financialInfos2]

describe("RealEstate", () => {

    async function deployOneYearLockFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        const Lock = await ethers.getContractFactory("RealEstate");
        const lock = await Lock.deploy();
        return {lock, owner, otherAccount};
    }

    describe("Test getProperty functions", () => {

        it('Test getProperty', async () => {
            const {lock, owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            let property = await lock.connect(owner).getProperty(0);
            expect(property.name).equals("name property1");
        });
    })

    describe("Add new Real Estate property", () => {

        it('Reverted ... Test on only Owner', async () => {
            const {lock, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(otherAccount).addProperty(property1)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it('Reverted ... Test The property have a name', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(owner).addProperty(propertyWithoutName)).to.be.revertedWith(
                "The name of the property is mandatory"
            );
        });

        it('Reverted ... Test The price of the property is superior to 0', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(owner).addProperty(propertyWithNullTokenPrice)).to.be.revertedWith(
                "The price of the property should be superior to 0"
            );
        });

        it('Reverted ... Test The property have a tokens number superior to 0', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(owner).addProperty(propertyWithNullTokenNumber)).to.be.revertedWith(
                "The token number of the property should be superior to 0"
            );
        });

        it("Add property pass, test event", async function () {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(owner).addProperty(property1)).not.to.be.reverted;
            await expect(lock.connect(owner).addProperty(property1))
                .to.emit(lock, "PropertyAdded")
                .withArgs(1);
        });

    })

    describe("Remove Real Estate property", () => {

        it('Reverted ... Test on only Owner', async () => {
            const {lock, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(otherAccount).deleteProperty(1)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it('Test the remove of property', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            await expect(lock.connect(owner).deleteProperty(0)).not.to.be.reverted;
            await expect(lock.connect(owner).deleteProperty(0))
                .to.emit(lock, "PropertyDeleted");
        });

    })

    describe("Update an existing Real Estate property", () => {

        it('Reverted ... Test on only Owner', async () => {
            const {lock, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(otherAccount).updateProperty(property1Updated)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it('Test the update of a property', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            await expect(lock.connect(owner).updateProperty(property1Updated)).not.to.be.reverted;
            await expect(lock.connect(owner).updateProperty(property1Updated))
                .to.emit(lock, "PropertyUpdated");
        });

    })

    describe("Publish Real Estate property", () => {

        it('Reverted ... Test on only Owner', async () => {
            const {lock, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(otherAccount).publishProperty(0)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it('Test the publish of a property', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            await expect(lock.connect(owner).publishProperty(0)).not.to.be.reverted;
            await expect(lock.connect(owner).publishProperty(0))
                .to.emit(lock, "PropertyPublished");
        });

    })

    describe("Mint NFT Estate property", () => {

        it('Reverted ... Test on only Owner', async () => {
            const {lock, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await expect(lock.connect(otherAccount).mintProperty(0)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it('Reverted ... Test The Mint or a non published property', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            await expect(lock.connect(owner).mintProperty(0)).to.be.revertedWith(
                "The property is not published yet"
            );
        });

        it('Test the mint of a property', async () => {
            const {lock, owner} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            await lock.connect(owner).publishProperty(0);
            let property = await lock.connect(owner).getProperty(0);
            let url = await lock.connect(owner).baseURI();
            await expect(lock.connect(owner).mintProperty(0))
                .to.emit(lock, "MintProperty");
            let firstToken = await lock.connect(owner).getToken(0);
            expect(firstToken.name).equals("Real Estate NFT")
            expect(firstToken.ownerAddress).equals(owner.address)
            expect(firstToken.propertyId).equals(property.id)
            expect(firstToken.url).equals(url);
        });

    })

    describe("Transfer NFT Estate property", () => {

        it('Test The Event Transfer to another account', async () => {
            const {lock, owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
            await lock.connect(owner).addProperty(property1);
            await lock.connect(owner).publishProperty(0);
            await lock.connect(owner).mintProperty(0);
            await expect(lock.connect(owner).transferTo(otherAccount.address, 0, {value: ethers.utils.parseEther("0.5")}))
                .to.emit(lock, "TransferToken");
        });

        it('Test The Transfer to another account', async () => {
            const {lock, owner, otherAccount} = await loadFixture(deployOneYearLockFixture);
            let url = await lock.connect(owner).baseURI();
            await lock.connect(owner).addProperty(property1);
            await lock.connect(owner).publishProperty(0);
            await lock.connect(owner).mintProperty(0);
            let property = await lock.connect(owner).getProperty(0);
            await expect(lock.connect(owner).transferTo(otherAccount.address, 0, {value: ethers.utils.parseEther("0.5")}))
                .to.emit(lock, "TransferToken");
            let clientTokens = await lock.connect(owner).clientsTokens(otherAccount.address, 0);
            expect(clientTokens.ownerAddress).equals(otherAccount.address)
            expect(clientTokens.propertyId).equals(property.id)
            expect(clientTokens.url).equals(url);
        });

    })
})