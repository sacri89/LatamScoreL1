async function main() {

    const LatamScoreRegistry =
        await ethers.getContractFactory(
            "LatamScoreRegistry"
        );

    const contract =
        await LatamScoreRegistry.deploy();

    await contract.waitForDeployment();

    console.log(
        "Contrato desplegado en:",
        await contract.getAddress()
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});