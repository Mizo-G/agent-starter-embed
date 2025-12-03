import type { Participant, Room } from 'livekit-client';

async function findAgent(room: Room): Promise<Participant | null> {
  return Array.from(room.remoteParticipants.values()).find((p) => p.isAgent) || null;
}

export async function sendDomElements(room: Room, payload: string) {
  const agent = await findAgent(room);
  if (!agent) throw new Error('Agent not found');

  return room.localParticipant.performRpc({
    destinationIdentity: agent.identity,
    method: 'dom_elements',
    payload: JSON.stringify(payload),
  });
}

export async function callAgentAction(room: Room, action: string) {
  const agent = await findAgent(room);
  if (!agent) throw new Error('Agent not found');

  return room.localParticipant.performRpc({
    destinationIdentity: agent.identity,
    method: 'agent.action',
    payload: action,
  });
}
