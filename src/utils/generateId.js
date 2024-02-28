import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 12 });

export default function generateId() {
	return uid.rnd();
}
