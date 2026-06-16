async function main() {
  const ExamStorage = await ethers.getContractFactory("ExamStorage");

  console.log("Deploying contract...");

  const examStorage = await ExamStorage.deploy();

  await examStorage.waitForDeployment();

  console.log(
    "ExamStorage deployed to:",
    await examStorage.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });