import {Howl, HowlOptions} from 'howler';
import * as Globals from '../../Globals';

export enum SoundScope {
    GAMEFLOW_LOBBY_AMBIENT,
    GAMEFLOW_CHAMP_SELECT,
}

export enum SoundReplacementPolicy {
    REPLACE_ALWAYS,
    REPLACE_IF_NULL,
    REPLACE_IF_DIFFERENT
}

export enum DefaultSound {
    GAMEFLOW_LOBBY_AMBIENT,
    READY_CHECK_APPEAR,
    READY_CHECK_ACCEPT,
    READY_CHECK_DECLINE
}

export interface SoundScopeElement {
    src: string;
    volume: number;
    sound: Howl;
    policy: SoundReplacementPolicy;
}

export interface SoundScopeConfig {
    defaultVolume: number;
}

interface CustomHowlOptions extends Omit<HowlOptions, 'src'> {

}

interface DefaultSoundElement {
    src: string;
    volume: number;
    policy: SoundReplacementPolicy;
    loop?: boolean;
    options?: CustomHowlOptions;
}

const DEFAULT_VOLUME = 0.5;
const DEFAULT_FADEIN_DURATION_MS = 1500;
const DEFAULT_FADEOUT_DURATION_MS = 1500;


const DEFAULT_SOUND_ELEMENTS: Record<DefaultSound, DefaultSoundElement> = {
    [DefaultSound.GAMEFLOW_LOBBY_AMBIENT]: {
        src: 'https://raw.communitydragon.org/14.6/plugins/rcp-be-lol-game-data/global/default/assets/events/sfm2023marketing/sfx-sfmk-mus.ogg',
        volume: DEFAULT_VOLUME,
        loop: true,
        policy: SoundReplacementPolicy.REPLACE_IF_DIFFERENT
    },
    [DefaultSound.READY_CHECK_APPEAR]: {
        src: Globals.STATIC_PREFIX + '/assets/ogg/gameflow/readycheck/appear.ogg',
        volume: DEFAULT_VOLUME,
        policy: SoundReplacementPolicy.REPLACE_IF_NULL
    },
    [DefaultSound.READY_CHECK_ACCEPT]: {
        src: Globals.STATIC_PREFIX + '/assets/ogg/gameflow/readycheck/accept.ogg',
        volume: DEFAULT_VOLUME,
        policy: SoundReplacementPolicy.REPLACE_IF_NULL
    },
    [DefaultSound.READY_CHECK_DECLINE]: {
        src: Globals.STATIC_PREFIX + '/assets/ogg/gameflow/readycheck/decline.ogg',
        volume: DEFAULT_VOLUME,
        policy: SoundReplacementPolicy.REPLACE_IF_NULL
    }
};

class ReworkedMusicSystem {
    private static instance: ReworkedMusicSystem;

    private constructor() {
        this.log('Initialized');
    }

    private log(...args: unknown[]): void {
        console.log(
            '[ReworkedMusicSystem]',
            ...args
        );
    }

    private currentSounds: Record<SoundScope, SoundScopeElement | undefined> = {
        [SoundScope.GAMEFLOW_LOBBY_AMBIENT]: undefined,
        [SoundScope.GAMEFLOW_CHAMP_SELECT]: undefined
    };

    public static getInstance(): ReworkedMusicSystem {
        if (!ReworkedMusicSystem.instance) {
            ReworkedMusicSystem.instance = new ReworkedMusicSystem();
        }
        return ReworkedMusicSystem.instance;
    }

    public shutdown(): void {
        this.log('Shutting down');
        this.stopAllSounds();
    }

    private stopAllSounds(): void {
        this.log('Stopping all sounds');
        Object.values(SoundScope).forEach(
            (scope: SoundScope) => {
                this.stopScope(scope);
            }
        );
    }

    public stopScope(scope: SoundScope, fadeOutDuration?: number): void {
        const currentSound = this.currentSounds[scope];
        if (!currentSound) {
            return;
        }
        delete this.currentSounds[scope];
        currentSound.sound.fade(
            currentSound.sound.volume(),
            0,
            fadeOutDuration ?? DEFAULT_FADEOUT_DURATION_MS
        );

        setTimeout(
            () => {
                this.log('Cleanup after fadeout', scope);
                currentSound.sound.mute(true);
                currentSound.sound.stop();
            },
            ((fadeOutDuration ?? DEFAULT_FADEOUT_DURATION_MS) + 100)
        );
    }

    public static createSoundElement(
        src: string,
        volume: number,
        policy: SoundReplacementPolicy,
        options?: CustomHowlOptions
    ): SoundScopeElement {
        return {
            src,
            volume,
            sound: new Howl({
                src,
                volume,
                ...options
            }),
            policy
        };
    }

    private createSoundElementFromDefaultSound(defaultSound: DefaultSound): SoundScopeElement {
        const defaultSoundElement = DEFAULT_SOUND_ELEMENTS[defaultSound];
        if (!defaultSoundElement) {
            throw new Error('Default sound element not found');
        }

        return {
            src: defaultSoundElement.src,
            volume: defaultSoundElement.volume,
            sound: new Howl({
                src: defaultSoundElement.src,
                volume: defaultSoundElement.volume,
                loop: defaultSoundElement.loop ?? false,
                ...defaultSoundElement.options
            }),
            policy: defaultSoundElement.policy
        };
    }

    public playDefaultSoundSFX(key: DefaultSound, delay: number): void {
        this.log('Playing default sound SFX', key);
        const defaultSoundElement = DEFAULT_SOUND_ELEMENTS[key];
        if (!defaultSoundElement) {
            this.log('Default sound element not found');
            return;
        }

        this.playSoundSFX(
            this.createSoundElementFromDefaultSound(key),
            delay
        );
    }

    public playSoundSFX(soundElement: SoundScopeElement, delay: number): void {
        setTimeout(
            () => {
                console.log('Playing sound SFX', soundElement);
                soundElement.sound.play();
            },
            delay
        );
    }

    public playDefaultSound(scope: SoundScope, key: DefaultSound): void {
        this.log('Playing default sound', scope, key);
        const defaultSoundElement = DEFAULT_SOUND_ELEMENTS[key];
        if (!defaultSoundElement) {
            this.log('Default sound element not found');
            return;
        }


        this.playSound(
            scope,
            this.createSoundElementFromDefaultSound(key)
        );
    }

    public playSound(scope: SoundScope, soundElement: SoundScopeElement): void {
        console.log('Playing sound', scope, soundElement);
        const previousSound = this.currentSounds[scope];
        switch (soundElement.policy) {
            case SoundReplacementPolicy.REPLACE_IF_NULL:
                if (previousSound) {
                    this.log('Sound already playing', scope);
                    return;
                }
                this.replaceSound(
                    scope,
                    soundElement
                );
                break;
            case SoundReplacementPolicy.REPLACE_IF_DIFFERENT:
                if (previousSound && previousSound.src === soundElement.src) {
                    this.log('Sound already playing', scope);
                    return;
                }
                this.replaceSound(
                    scope,
                    soundElement
                );
                break;
            case SoundReplacementPolicy.REPLACE_ALWAYS:
                this.replaceSound(
                    scope,
                    soundElement
                );
                break;
        }
    }


    private replaceSound(scope: SoundScope, soundElement: SoundScopeElement): void {
        const previousSound = this.currentSounds[scope];
        this.log('Replacing sound', scope, soundElement);
        this.currentSounds[scope] = soundElement;
        if (previousSound) {
            previousSound.sound.fade(
                previousSound.sound.volume(),
                0,
                DEFAULT_FADEOUT_DURATION_MS
            );
            setTimeout(
                () => {
                    previousSound.sound.mute(true);
                    previousSound.sound.stop();
                },
                DEFAULT_FADEOUT_DURATION_MS + 100
            );
        }
        soundElement.sound.play();
        soundElement.sound.volume(0);
        soundElement.sound.fade(
            0,
            soundElement.volume,
            DEFAULT_FADEIN_DURATION_MS
        );
    }

}

export default ReworkedMusicSystem;