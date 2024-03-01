import { Directive, DirectiveBinding, VueElement } from "vue";
import { DirectiveTuple } from "./tuple";

export enum MediaType {
  IMAGE = 0,
  VIDEO = 1
}

interface MediaTypeDict {
  url: string,
  type: MediaType,
}

export default function (): DirectiveTuple<MediaTypeDict> {
  const name = "mediaMatch";

  const vMediaMatch: Directive<VueElement, MediaTypeDict> = {
    mounted: (el: VueElement, bindings: DirectiveBinding<MediaTypeDict>) => {
      const { url, type } = bindings.value;
      const ext = url.substring(url.lastIndexOf(".") + 1);
      // 图片判断
      if (type === MediaType.IMAGE) {
        if (!["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          el.remove();
        }
        // 视频判断
      } else if (type === MediaType.VIDEO) {
        if (!["avi", "mkv", "mpeg", "mp4", "m4v", "flv", "webm"].includes(ext)) {
          el.remove();
        }
      }
    },
  };
  return [name, vMediaMatch];
}
