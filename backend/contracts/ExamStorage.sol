// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ExamStorage {

    struct Paper {
        string examCode;
        string hash;
        uint256 unlockTime;
        address uploadedBy;
    }

    mapping(string => Paper) public papers;

    function storePaper(
        string memory _examCode,
        string memory _hash,
        uint256 _unlockTime
    ) public {
        papers[_examCode] = Paper({
            examCode: _examCode,
            hash: _hash,
            unlockTime: _unlockTime,
            uploadedBy: msg.sender
        });
    }

    function getPaper(string memory _examCode)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address
        )
    {
        Paper memory p = papers[_examCode];

        return (
            p.examCode,
            p.hash,
            p.unlockTime,
            p.uploadedBy
        );
    }
}