/* eslint-disable @typescript-eslint/naming-convention */
import { UserInputError } from 'apollo-server';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { knex } from '~/src/shared';
import 'mocha';
import { convertTag } from '~/src/datasources/News';
import NotificationsAPI, { convertToken } from '~/src/datasources/Notifications';
import * as sql from '~/src/types/news';
import createTags from './tags.spec';
import { Token } from '~/src/types/notifications';

chai.use(spies);
const sandbox = chai.spy.sandbox();

const createTokens: Partial<Token>[] = [
  {
    expo_token: 'Token1',
  },
  {
    expo_token: 'Token2',
  },
];

let tokens: Token[];
let tags: sql.Tag[];
let members: any[];
let keycloak: any[];

const insertTokens = async () => {
  members = await knex('members').insert([{ student_id: 'ab1234cd-s' }, { student_id: 'ef4321gh-s' }, { student_id: 'dat12abc' }]).returning('*');
  keycloak = await knex('keycloak').insert([{ keycloak_id: '1', member_id: members[0].id }, { keycloak_id: '2', member_id: members[1].id }, { keycloak_id: '3', member_id: members[2].id }]).returning('*');
  tokens = await knex('expo_tokens').insert(createTokens).returning('*');
};

const insertTags = async () => {
  tags = await knex('tags').insert(createTags).returning('*');
};

const expectToThrow = async (fn: () => Promise<any>, error: any) => {
  let thrown = true;
  try {
    await fn();
    thrown = false;
  } catch (e) {
    expect(e).to.be.instanceOf(error);
  }
  if (!thrown) expect.fail('Expected to throw');
};

const notificationsAPI = new NotificationsAPI(knex);

describe('[NotificationsAPI]', () => {
  beforeEach(async () => {
    sandbox.on(notificationsAPI, 'withAccess', (name, context, fn) => fn());
    await insertTokens();
    await insertTags();
  });

  afterEach(async () => {
    await knex('keycloak').del();
    await knex('members').del();
    await knex('expo_tokens').del();
    await knex('tags').del();
    await knex('tag_subscriptions').del();
    sandbox.restore();
  });

  describe('[getToken]', () => {
    it('returns token given expo token', async () => {
      const { expo_token } = tokens[0];
      const res = await notificationsAPI.getToken(expo_token);
      expect(res).to.deep.equal(convertToken(tokens[0]));
    });

    it('returns empty subscribed tags', async () => {
      const { keycloak_id } = keycloak[0];
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([]);
    });
  });

  describe('[registerToken]', () => {
    it('registers a new token and returns it', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token100';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
    });

    it('re-registers a token', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token1';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
    });

    it('registers token with new member', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token100';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
      expect(res.memberId).to.equal(members[0].id);
    });

    it('re-registers token with new member', async () => {
      const { keycloak_id } = keycloak[0];
      const newToken = 'Token1';
      const res = await notificationsAPI.registerToken({ user: { keycloak_id } }, newToken);
      expect(res.expo_token).to.equal(newToken);
      expect(res.memberId).to.equal(members[0].id);
    });
  });

  describe('[subscribeTags]', () => {
    it('subscribes to a tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([convertTag(tag)]);
    });

    it('subscribes to a tag that is already subscribed to', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([convertTag(tag)]);
    });

    it('fails on subscribtion of non-existing tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tagId = 'nonexistingid';
      expectToThrow(
        () => notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tagId]),
        UserInputError,
      );
    });
  });

  describe('[unsubscribeTags]', () => {
    it('unsubscribes to a tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.subscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res1 = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res1).to.deep.equal([convertTag(tag)]);
      await notificationsAPI.unsubscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res2 = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res2).to.deep.equal([]);
    });

    it('unsubscribes to a tag that isn\'t subscribed to', async () => {
      const { keycloak_id } = keycloak[0];
      const tag = tags[0];
      await notificationsAPI.unsubscribeTags({ user: { keycloak_id } }, [tag.id]);
      const res = await notificationsAPI.getSubscribedTags({ user: { keycloak_id } });
      expect(res).to.deep.equal([]);
    });

    it('does not fail on unsubscribtion of non-existing tag', async () => {
      const { keycloak_id } = keycloak[0];
      const tagId = 'nonexistingtag';
      expectToThrow(
        () => notificationsAPI.unsubscribeTags({ user: { keycloak_id } }, [tagId]),
        UserInputError,
      );
      // await notificationsAPI.unsubscribeTags({user: {keycloak_id: keycloakId}}, [tagId]);
      // const res = await notificationsAPI.getSubscribedTags(token.id);
      // expect(res).to.deep.equal([]);
    });
  });
});
