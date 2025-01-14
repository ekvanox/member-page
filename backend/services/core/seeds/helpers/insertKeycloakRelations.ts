import { Knex } from 'knex';
import { Keycloak } from '~/src/types/database';

export default async function insertKeycloakRelations(
  knex: Knex,
  memberIds: string[],
): Promise<void> {
  await knex<Keycloak>('keycloak').insert([
    {
      member_id: memberIds[0],
      keycloak_id: '089965a5-05bd-4271-ad92-d1ede7f54564',
    },
    {
      member_id: memberIds[1],
      keycloak_id: '2eed06cc-6c18-48de-9a06-6616744cc624',
    },
    {
      member_id: memberIds[2],
      keycloak_id: '88142f8e-a0d1-42fc-b486-758f56b114e4',
    },
    {
      member_id: memberIds[3],
      keycloak_id: '526583e8-b4eb-4ac6-9291-43fe94218278',
    },
    {
      member_id: memberIds[4],
      keycloak_id: '164298da-fb22-4732-b790-080cac4cb542',
    },
    {
      member_id: memberIds[5],
      keycloak_id: 'd95d29de-a919-48f4-a51c-ff237856f0ce',
    },
    {
      member_id: memberIds[6],
      keycloak_id: '4eeb75d0-19e1-4a06-81d1-593baf34dfc0',
    },
    {
      member_id: memberIds[7],
      keycloak_id: 'acdf9966-3038-421e-b2f5-8edfcd2fc39a',
    },
  ]);
}
