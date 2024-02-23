function getMainActivity() {
    let activityThread = Java.use("android.app.ActivityThread").sCurrentActivityThread.value;
    let mActivities = activityThread.mActivities.value
	let activityClientRecord = Java.cast(mActivities.valueAt(0), Java.use("android.app.ActivityThread$ActivityClientRecord"))
    return activityClientRecord.activity.value
}

class BuilderSimulationClick {
	#classes = {
		MotionEvent: Java.use("android.view.MotionEvent"),
		SystemClock: Java.use("android.os.SystemClock"),
		LinearLayout: Java.use("android.widget.LinearLayout"),
		LinearParams: Java.use("android.widget.LinearLayout$LayoutParams"),
		MATCH_PARENT: Java.use("android.widget.LinearLayout$LayoutParams").MATCH_PARENT.value,
		WRAP_CONTENT: Java.use("android.widget.LinearLayout$LayoutParams").WRAP_CONTENT.value,
		TextView: Java.use("android.widget.TextView"),
		String: Java.use("java.lang.String"),
		Gravity: Java.use("android.view.Gravity")
	};

	#mainLayout = null;
	#Layout = null;
	#Text = null;
	#downTime = 0;
	#eventTime = 0;

	constructor() {
		this.#mainLayout = this.#classes.LinearLayout.$new(getMainActivity());
		this.#mainLayout.setLayoutParams(this.#classes.LinearParams.$new(this.#classes.MATCH_PARENT, this.#classes.MATCH_PARENT));
		this.#mainLayout.setBackgroundColor(Java.use("android.graphics.Color").TRANSPARENT.value);
	}

	createLayout(title){
		this.#Layout = this.#classes.LinearLayout.$new(getMainActivity());
		this.#Layout.setBackgroundColor(Java.use("android.graphics.Color").BLACK.value);
		this.#Layout.setLayoutParams(this.#classes.LinearParams.$new(32, 32));
		this.#Layout.setOnTouchListener(this.#move());

		this.#Text = this.#classes.TextView.$new(getMainActivity());
		this.#Text.setText(this.#classes.String.$new(title));
		this.#Text.setLayoutParams(this.#Layout.getLayoutParams());
		this.#Text.setGravity(this.#classes.Gravity.CENTER.value);
		this.#Text.setTextColor(Java.use("android.graphics.Color").WHITE.value);

		this.#Layout.addView(this.#Text);
		this.#mainLayout.addView(this.#Layout);
	}

	#move() {
		var initialX = 0;
		var initialY = 0;

		const onMoveLayout = Java.registerClass({
			name : "com.example.LayoutMove",
			implements: [Java.use("android.view.View$OnTouchListener")],
			methods: {
				onTouch(View, MotionEvent) {
					var x = MotionEvent.getRawX();
					var y = MotionEvent.getRawY();

					switch(MotionEvent.getAction()) {
						case android.view.MotionEvent.ACTION_DOWN.value:
							initialX = View.getX() - x;
							initialY = View.getY() - y;
						break;

						case android.view.MotionEvent.ACTION_MOVE.value:
							View.setX(x + initialX);
							View.setY(y + initialY);
						break;
					}

					//console.log("X:" + x + " Y:" + y);

					return true;
				}
			}
		});

		return onMoveLayout.$new();
	}

	click(self) {
		this.#downTime = this.#classes.SystemClock.uptimeMillis();
		this.#eventTime = this.#classes.SystemClock.uptimeMillis() + 100;
		var metaState = 0;

        var x = this.#Layout.getX() + (this.#Layout.getWidth() / 2);
		var y = this.#Layout.getY() + this.#Layout.getHeight() + 1;

		//console.log("X: " + x " Y: " y);

		let motionEvent = this.#classes.MotionEvent.obtain(
	        this.#downTime,
	        this.#eventTime,
	        this.#classes.MotionEvent.ACTION_DOWN.value,
	        parseInt(x),
	        parseInt(y),
	        metaState
		);

		getMainActivity().dispatchTouchEvent(motionEvent);

		motionEvent = this.#classes.MotionEvent.obtain(
	        this.#downTime,
	        this.#eventTime,
	        this.#classes.MotionEvent.ACTION_UP.value,
	        parseInt(x),
	        parseInt(y),
	        metaState
		);

		getMainActivity().dispatchTouchEvent(motionEvent);
	}

	build() {
		getMainActivity().addContentView(this.#mainLayout, this.#mainLayout.getLayoutParams());
	}
}
