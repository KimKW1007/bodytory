import type { NextApiRequest, NextApiResponse } from "next";
import client from "utils/server/client";
import withHandler from "@utils/server/withHandler";
import { withApiSession } from "@utils/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.session;
  if (req.method === "GET") return await myHospitalList(req, res);
  if (user?.id === 35) return res.status(204).end();
  if (req.method === "POST") return await addHospital(req, res);
  if (req.method === "PUT") return await shareHospital(req, res);
  if (req.method === "DELETE") return await deleteHospital(req, res);
};

async function addHospital(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const { user } = req.session;
  if (user?.id === 142) return res.status(204).end();
  if (!user) return res.status(401).send("회원 정보를 확인해주세요");
  const isConnected = await client.hospitalToUser.findFirst({
    where: {
      hospitalId: id,
      userId: user.id,
    },
  });
  if (isConnected) return res.status(204).end();
  await client.hospitalToUser.create({
    data: {
      hospitalId: id,
      userId: user.id,
    },
  });
  return res.status(200).end();
}
async function shareHospital(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const { user } = req.session;
  if (!user) return res.status(401).send("회원 정보를 확인해주세요");
  const isConnected = await client.hospitalToUser.findFirst({
    where: {
      hospitalId: id,
      userId: user.id,
    },
  });
  if (!isConnected) return res.status(204).end();
  await client.hospitalToUser.update({
    where: {
      id: isConnected.id,
    },
    data: {
      shared: !isConnected.shared,
    },
  });
  return res.status(200).end();
}
async function myHospitalList(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session;
  if (!user) return res.status(401).send("회원 정보를 확인해주세요");
  const data = await client.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      hospitals: {
        select: {
          shared: true,
          hospital: {
            include: {
              medicalDepartments: {
                select: {
                  medicalDepartment: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return res.status(200).json(data?.hospitals);
}
async function deleteHospital(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const { user } = req.session;
  if (user?.id === 142) return res.status(204).end();
  if (!user) return res.status(401).send("회원 정보를 확인해주세요");
  const isConnected = await client.hospitalToUser.findFirst({
    where: {
      hospitalId: id,
      userId: user.id,
    },
  });
  if (!isConnected) return res.status(204).end();
  const result = await client.hospitalToUser.deleteMany({
    where: {
      hospitalId: id,
      userId: user.id,
    },
  });
  return res.status(200).end();
}

export default withApiSession(withHandler({ methods: ["POST", "GET", "PUT", "DELETE"], handler }));
