"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../blockchain/contract";

export default function Home() {

  const [wallet, setWallet] = useState("");
  const [scoreAddress, setScoreAddress] = useState("");
  const [score, setScore] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [scoreData, setScoreData] =
    useState(null);

  async function connectWallet() {

    try {

      const accounts =
        await window.ethereum.request({
          method: "eth_requestAccounts"
        });

      setWallet(accounts[0]);

    } catch (err) {

      console.error(err);
    }
  }

  async function registerScore() {

    try {

      if (!ethers.isAddress(scoreAddress)) {

        setResult("Wallet inválida");
        return;
      }

      setLoading(true);

      const contract =
        await getContract();

      const tx =
        await contract.registerScore(
          scoreAddress,
          score
        );

      setResult(
        "Esperando confirmación..."
      );

      await tx.wait();

      setLoading(false);

      setResult(
        "Score registrado exitosamente"
      );

    } catch (err) {

      console.error(err);

      setLoading(false);

      if (
        err.message.includes(
          "Not authorized"
        )
      ) {

        setResult("No autorizado");

      } else {

        setResult(
          "Error registrando"
        );
      }
    }
  }

  async function getScore() {

    try {

      if (!ethers.isAddress(scoreAddress)) {

        setResult("Wallet inválida");
        return;
      }

      setLoading(true);

      const contract =
        await getContract();

      const data =
        await contract.getScore(
          scoreAddress
        );

      const scoreValue =
        data[0].toString();

      const timestamp =
        new Date(
          Number(data[1]) * 1000
        ).toLocaleString();

      let risk = "Medium Risk";

      if (scoreValue >= 800) {
        risk = "Low Risk";
      }

      if (scoreValue < 500) {
        risk = "High Risk";
      }

      setScoreData({
        score: scoreValue,
        timestamp,
        risk
      });

      setLoading(false);

      setResult(
        "Análisis completado"
      );

    } catch (err) {

      console.error(err);

      setLoading(false);

      setResult(
        "Perfil no encontrado"
      );
    }
  }

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-6xl font-bold">
              LatamScore
            </h1>

            <p className="text-zinc-400 mt-2">
              Financial Reputation Infrastructure
            </p>

          </div>

          <button
            onClick={connectWallet}
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold"
          >
            {
              wallet
                ? "Wallet Connected"
                : "Connect Wallet"
            }
          </button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Credit Engine
            </h2>

            <div className="space-y-5">

              <input
                className="w-full bg-black border border-zinc-700 rounded-2xl p-4"
                placeholder="Wallet Address"
                value={scoreAddress}
                onChange={(e) =>
                  setScoreAddress(
                    e.target.value
                  )
                }
              />

              <input
                className="w-full bg-black border border-zinc-700 rounded-2xl p-4"
                placeholder="Credit Score"
                value={score}
                onChange={(e) =>
                  setScore(
                    e.target.value
                  )
                }
              />

              <div className="flex gap-4">

                <button
                  onClick={registerScore}
                  className="flex-1 bg-blue-600 rounded-2xl py-4 font-semibold"
                >
                  Register Score
                </button>

                <button
                  onClick={getScore}
                  className="flex-1 bg-green-600 rounded-2xl py-4 font-semibold"
                >
                  Analyze Wallet
                </button>

              </div>

            </div>

            <div className="mt-8">

              <p className="text-zinc-400 mb-3">
                System Output
              </p>

              <div className="bg-black border border-zinc-800 rounded-2xl p-4 min-h-[80px]">

                {
                  loading
                    ? "Processing..."
                    : result
                }

              </div>

            </div>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Reputation Analytics
            </h2>

            {
              scoreData ? (

                <div>

                  <div className="flex justify-center mb-8">

                    <div className="w-60 h-60 rounded-full border-[16px] border-zinc-700 flex items-center justify-center">

                      <div className="text-center">

                        <p className="text-zinc-400">
                          Credit Score
                        </p>

                        <h1 className="text-7xl font-bold mt-2">
                          {scoreData.score}
                        </h1>

                      </div>

                    </div>

                  </div>

                  <div className="space-y-4">

                    <div className="bg-black border border-zinc-800 rounded-2xl p-5">

                      <p className="text-zinc-400 mb-1">
                        Risk Level
                      </p>

                      <h3 className="text-3xl font-bold">
                        {scoreData.risk}
                      </h3>

                    </div>

                    <div className="bg-black border border-zinc-800 rounded-2xl p-5">

                      <p className="text-zinc-400 mb-1">
                        Last Update
                      </p>

                      <h3 className="text-lg font-semibold break-words">
                        {scoreData.timestamp}
                      </h3>

                    </div>

                    <div className="bg-black border border-zinc-800 rounded-2xl p-5">

                      <p className="text-zinc-400 mb-1">
                        Verification
                      </p>

                      <h3 className="text-2xl font-bold text-cyan-400">
                        VERIFIED ON-CHAIN
                      </h3>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="h-full flex items-center justify-center text-center text-zinc-500">

                  <div>

                    <h3 className="text-3xl font-bold mb-3">
                      No Analysis Yet
                    </h3>

                    <p>
                      Analyze a wallet to generate reputation data
                    </p>

                  </div>

                </div>

              )
            }

          </div>

        </div>

      </div>

    </main>
  );
}