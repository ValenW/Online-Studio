function playSound(key, head, tail) {
	speed = 100;
	JZZ().openMidiOut().wait(head*100).send([0x90,key,127]).wait(tail*100).send([0x80, key, 0]);
}

function test() {
      playSound(80, 5, 30);
      playSound(80, 10, 20);
 }