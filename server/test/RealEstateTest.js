const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

const vi = artifacts.require('RealEstate');

contract("Voting", function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];

    context("Add Voters Phase", function () {

        beforeEach(async function () {

        })

    })
})