export class WsMessagePayload {
  event: string;
  data: WsPayloadData;
}

export class WsPayloadData {
  game: string;
  who: string;
  heat_into: string;
  action: string;
  content: string;
}
